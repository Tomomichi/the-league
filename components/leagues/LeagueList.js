import React, { useState, useContext } from 'react';
import Link from 'next/link'
import { firebase, getLeagues } from '../../lib/firebase.js'


export default function LeagueList({result, limit, userId}) {
  const [items, setItems] = useState(result);
  const initialStartAfter = result.length == limit ? result[result.length - 1].createdAt : null;
  const [startAfter, setStartAfter] = useState(initialStartAfter);
  const [endBefore, setEndBefore] = useState(null);


  const remove = (id) => {
    const confirmed = confirm('データを削除します。よろしいですか？');
    if(!confirmed){ return; }

    firebase.firestore().collection('leagues').doc(id).delete().then(() => {
      setItems(items.filter(i => i.id != id));
      // setSnackbar({open: true, message: '年表が削除されました'});
    }).catch(function(error) {
      console.error("Error removing document: ", error);
      // setSnackbar({open: true, message: 'データ削除に失敗しました。。しばらく経っても解決しない場合、運営までお問い合わせください。'});
    });
  }

  const showNextPage = async (at) => {
    const res = await getLeagues({limit: limit + 1, startAfter: at}); // 1つ多く取得して次ページあるか確認

    // 次のページがあればnextStartAfterにセット
    if(res.length == limit + 1) {
      res.pop(); // pop()で次ページ確認用のitemをitemsから消す
      setStartAfter(res[limit-1].createdAt);
    }else {
      setStartAfter(null);
    }
    setEndBefore(res[0].createdAt);
    setItems(res);
  }

  const showPrevPage = async (at) => {
    const res = await getLeagues({limit: limit + 1, endBefore: at}); // 1つ多く取得して次ページあるか確認

    // 次のページがあればnextStartAfterにセット
    if(res.length == limit + 1) {
      res.shift(); // shift()で次ページ確認用のitemをitemsから消す
      setEndBefore(res[0].createdAt);
    }else {
      setEndBefore(null);
    }
    setStartAfter(res[res.length-1].createdAt);
    setItems(res);
  }


  return (
    <>
      <ul>
        { items.map((item) => (
          <li key={item.id} className="px-2 py-4">
            <Link href='/leagues/[id]' as={`/leagues/${item.id}`}>
              <a className="text-blue-600 hover:opacity-75 mb-1">{item.title}</a>
            </Link>
            <div className="text-xs">{ item.createdAt.slice(0,10) }</div>
          </li>
        ))}
      </ul>

      <div>
        { endBefore &&
          <div>
            <div onClick={()=>{ showPrevPage(endBefore) }}>Prev</div>
          </div>
        }
        { startAfter &&
          <div flexGrow={1} textAlign="right">
            <div onClick={()=>{ showNextPage(startAfter) }}>Next</div>
          </div>
        }
      </div>
    </>
  );
}
