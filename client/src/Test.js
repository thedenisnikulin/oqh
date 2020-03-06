import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Test() {
  const [page, setPage] = useState();

  useEffect(() => {
    axios.get('http://localhost:5000/page')
      .then(res => setPage(res.data.page)
      .then(res => console.log(res)))
      .catch(err => console.log(err))
  });

  return (
    <div>
        <h1>look: {page}</h1>
    </div>
  );
}

export default Test;
