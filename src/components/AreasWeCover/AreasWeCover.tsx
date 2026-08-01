import React from 'react';

type Props = {
  html: string;
};

const AreasWeCover = ({ html }: Props) => {
  return (
    <div className="w-full mt-14 px-6 mobilelg:px-2 max-w-[1200px] mx-auto">
      <div className="areas-cms prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default AreasWeCover;
