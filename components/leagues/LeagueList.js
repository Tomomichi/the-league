import React, { useState, useContext } from 'react';
import Link from 'next/link'
import { firebase, getLeagues } from '../../lib/firebase.js'
import { useSnackbar } from 'react-simple-snackbar'


export default function LeagueList({result, limit, userId}) {
  const [items, setItems] = useState(result);
  const initialStartAfter = result.length == limit ? result[result.length - 1].createdAt : null;
  const [startAfter, setStartAfter] = useState(initialStartAfter);
  const [endBefore, setEndBefore] = useState(null);
  const [openSnackbar, closeSnackbar] = useSnackbar({position: 'bottom-left'});


  const remove = (id) => {
    const confirmed = confirm('データを削除します。よろしいですか？');
    if(!confirmed){ return; }

    firebase.firestore().collection('leagues').doc(id).delete().then(() => {
      setItems(items.filter(i => i.id != id));
      openSnackbar('データを削除しました');
    }).catch(function(error) {
      console.error("Error removing document: ", error);
      openSnackbar('データ削除に失敗しました。。しばらく経っても解決しない場合、運営までお問い合わせください。');
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
      <ul className="divide-y mb-8">
        { items.map((item) => (
          <li key={item.id} className="hover:bg-gray-100">
            <Link href='/leagues/[id]' as={`/leagues/${item.id}`}>
              <a className="flex items-center justify-between py-3">
                <div className="flex-1 overflow-hidden">
                  <p className="truncate">{item.title}</p>
                  <span className="text-xs">{ item.createdAt.slice(0,10) }</span>
                </div>
                <svg className="w-6 h-6 fill-current text-gray-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                </svg>
              </a>
            </Link>
          </li>
        ))}
      </ul>

      <nav>
        <ul className="flex justify-between">
          <li>
            { endBefore &&
              <button className="flex border rounded pl-2 pr-4 py-1 hover:bg-gray-100" onClick={()=>{ showPrevPage(endBefore) }}>
                <svg className="w-6 h-6 fill-current text-gray-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                </svg>
                Prev
              </button>
            }
          </li>
          <li>
            { startAfter &&
              <button className="flex border rounded pl-4 pr-2 py-1 hover:bg-gray-100" onClick={()=>{ showNextPage(startAfter) }}>
                Next
                <svg className="w-6 h-6 fill-current text-gray-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                </svg>
              </button>
            }
          </li>
        </ul>
      </nav>
    </>
  );
}
