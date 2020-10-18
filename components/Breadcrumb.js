import Link from 'next/link'
import { useContext, useState } from 'react';

export default function Breadcrumb({items}){
  const defaultItems = [{name: 'Top', href: "/"}];
  return (
    <div className="bg-gray-100 text-sm border-b px-4 py-2 mb-8 full-bleed">
      <ul className="flex items-center">
        { defaultItems.concat(items).map((item, index) => {
          if(index !== items.length) {
            return(
              <div key={index} className="flex items-center">
                <li>
                  <Link href={item.href}>
                    <a className="text-blue-600 hover:opacity-75">{item.name}</a>
                  </Link>
                </li>
                <li><svg className={`mx-1 w-5 h-5 fill-current text-gray-500`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg></li>
              </div>
            );
          }else {
            return <li key={index} className="font-bold">{item.name}</li>
          }
        }) }
      </ul>
    </div>
  );
};
