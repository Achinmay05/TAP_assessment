import React, { useState, useEffect } from 'react'
// import NewsItem from './NewsItem';

export default function NewsContext() {

    const [category, setCategory] = useState("General");
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);
    // ***********************************************************
    const [networkInfo, setNetworkInfo] = useState({
  effectiveType: '',
  downlink: 0,
  rtt: 0,
  saveData: false
});

const fetchNetworkInfo = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    setNetworkInfo({
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    });
  }
};

useEffect(() => {
  fetchNetworkInfo();
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    connection.addEventListener('change', fetchNetworkInfo);
  }

  return () => {
    if (connection) {
      connection.removeEventListener('change', fetchNetworkInfo);
    }
  };
}, []);



    // ***********************************************************

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = async (currentPage) => {
        try {
            setLoading(true);
            const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=74a99a9ac7ff4f32bc3d488dc58fad27&page=${currentPage}&pageSize=12`;
            const data = await fetch(url);
            const parsedData = await data.json();

            if (parsedData.articles) {
                setArticles(parsedData.articles); // Update only if articles exist
                setTotalResults(parsedData.totalResults || 0); // Use default if undefined
            } else {
                setArticles([]); // Fallback to empty array
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching news:", error);
            setArticles([]); // Ensure articles is never undefined
            setLoading(false);
        }
    };


    useEffect(() => {
        document.title = `${capitalizeFirstLetter(category)} - NewsMonkey`;
        updateNews(1);
    }, [category])

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
        updateNews(pageNumber);
        window.scrollTo(0, 0);
    }

    const totalPages = Math.ceil(totalResults / 10);
    const paginationButtons = [];

    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
        paginationButtons.push(
            <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-3 py-1 mx-1 rounded ${page === i ? 'bg-black text-white' : 'bg-gray-900 hover:bg-gray-300 hover:text-black'}`}
            >
                {i}
            </button>
        );
    }

    return (
// ***********************************************************************8
<div className='w-full sm:w-[98%] h-auto mt-4 relative rounded'>
  <div className='w-full h-full bg-[#faf0e6] border-solid border-2 border-gray-500 absolute opacity-40 rounded'></div>
  <div className='p-4 relative w-full h-full rounded shadow-lg hover:shadow-gray-800'>
    <div className='font-bold text-2xl text-gray-800 mb-4'>📶 Network Information</div>
    <div className='text-gray-700 grid sm:grid-cols-2 grid-cols-1 gap-4 text-lg'>
      <div><strong>Connection Type:</strong> {networkInfo.effectiveType || "N/A"}</div>
      <div><strong>Download Speed:</strong> {networkInfo.downlink} Mbps</div>
      <div><strong>RTT:</strong> {networkInfo.rtt} ms</div>
      <div><strong>Data Saver Enabled:</strong> {networkInfo.saveData ? "Yes" : "No"}</div>
    </div>
  </div>
</div>

// ***********************************************************************8

        // <div className='w-full h-[98%] overflow-y-auto flex flex-col sm:flex-row text-gray-700'>
        //     <div className='sm:w-[20%] w-full h-auto flex flex-col cursor-pointer'>
        //         <div className="w-full h-auto pl-2 pr-2 pb-0 mb-0 text-7xl flex items-center justify-center bg-clip-text text-gray-800 bg-gradient-to-b from-neutral-50 to-neutral-400"> NEWS </div>
        //         {/* <div className="w-full h-auto pl-1 pr-1 pt-0 mt-0 mb-1 text-8xl flex items-center justify-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-neutral-800">WS</div> */}
        //         <br />
        //         <div className='w-full relative h-11' onClick={() => { setCategory("General") }}>
        //             <div className={`absolute w-full h-full rounded-l-xl ${category === "General" ? "bg-gray-500 opacity-40" : ""}`}></div>
        //             <div className='absolute w-full text-xl font-extrabold tracking-normal hover:tracking-wider transition-all duration-300  h-full flex items-center justify-center bg-transparent'>GENERAL</div>
        //         </div>
        //         <div className='w-full relative h-11' onClick={() => { setCategory("Sports") }}>
        //             <div className={`absolute w-full h-full rounded-l-xl ${category === "Sports" ? "bg-gray-500 opacity-40" : ""}`}></div>
        //             <div className='absolute w-full text-xl font-extrabold tracking-normal hover:tracking-wider transition-all duration-300  h-full flex items-center justify-center bg-transparent'>SPORTS</div>
        //         </div>
        //         <div className='w-full relative h-11' onClick={() => { setCategory("Business") }}>
        //             <div className={`absolute w-full h-full rounded-l-xl ${category === "Business" ? "bg-gray-500 opacity-40" : ""}`}></div>
        //             <div className='absolute w-full text-xl font-extrabold tracking-normal hover:tracking-wider transition-all duration-300  h-full flex items-center justify-center bg-transparent'>BUSINESS</div>
        //         </div>
        //         <div className='w-full relative h-11' onClick={() => { setCategory("Entertainment") }}>
        //             <div className={`absolute w-full h-full rounded-l-xl ${category === "Entertainment" ? "bg-gray-500 opacity-40" : ""}`}></div>
        //             <div className='absolute w-full text-xl font-extrabold tracking-normal hover:tracking-wider transition-all duration-300  h-full flex items-center justify-center bg-transparent'>ENTERAINMENT</div>
        //         </div>
        //         <div className='w-full relative h-11' onClick={() => { setCategory("Health") }}>
        //             <div className={`absolute w-full h-full rounded-l-xl ${category === "Health" ? "bg-gray-500 opacity-40" : ""}`}></div>
        //             <div className='absolute w-full text-xl font-extrabold tracking-normal hover:tracking-wider transition-all duration-300  h-full flex items-center justify-center bg-transparent'>HEALTH</div>
        //         </div>
        //         <div className='w-full relative h-11' onClick={() => { setCategory("Science") }}>
        //             <div className={`absolute w-full h-full rounded-l-xl ${category === "Science" ? "bg-gray-500 opacity-40" : ""}`}></div>
        //             <div className='absolute w-full text-xl font-extrabold tracking-normal hover:tracking-wider transition-all duration-300  h-full flex items-center justify-center bg-transparent'>SCIENCE</div>
        //         </div>
        //         <div className='w-full relative h-11' onClick={() => { setCategory("Technology") }}>
        //             <div className={`absolute w-full h-full rounded-l-xl ${category === "Technology" ? "bg-gray-500 opacity-40" : ""}`}></div>
        //             <div className='absolute w-full text-xl font-extrabold tracking-normal hover:tracking-wider transition-all duration-300  h-full flex items-center justify-center bg-transparent'>TECHNOLOGY</div>
        //         </div>

        //     </div>
        //     <div className='sm:w-[2%] w-full sm:h-full h-16 sm:bg-gray-500 opacity-40'></div>
        //     <div className='sm:w-[78%] w-full h-auto sm:h-full relative mt-3 sm:mt-0'>
        //         <div className='absolute h-56  sm:bg-gray-500 opacity-40 w-full sm:h-full'></div>
        //         <div className='w-full absolute sm:h-full h-screen overflow-y-auto'>
        //             {loading ? (
        //                 <div className="text-center">
        //                     <h4>Loading articles...</h4>
        //                 </div>
        //             ) : (
        //                 <>
        //                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        //                         {articles && articles.length > 0 ? (
        //                             articles
        //                                 .filter((element) => element.title && element.description && element.urlToImage)
        //                                 .map((element) => (
        //                                     <div className="shadow-lg hover:shadow-gray-800 rounded-lg shadow-lg mx-auto flex flex-col" key={element.url}>
        //                                         <NewsItem
        //                                             title={element.title}
        //                                             description={element.description}
        //                                             imageUrl={element.urlToImage}
        //                                             newsUrl={element.url}
        //                                             author={element.author}
        //                                             date={element.publishedAt}
        //                                             source={element.source.name}
        //                                         />
        //                                     </div>
        //                                 ))
        //                         ) : (
        //                             <p>No articles available</p>
        //                         )}
        //                     </div>


        //                     <div className="flex justify-center items-center my-6">
        //                         {/* <button
        //                             onClick={() => handlePageChange(1)}
        //                             disabled={page === 1}
        //                             className="px-3 py-1 mx-1 rounded bg-gray-900 hover:bg-gray-300 hover:text-black disabled:opacity-50"
        //                         >
        //                             First
        //                         </button> */}
        //                         <button
        //                             onClick={() => handlePageChange(page - 1)}
        //                             disabled={page === 1}
        //                             className="px-3 py-1 mx-1 rounded bg-gray-900 hover:bg-gray-300 hover:text-black disabled:opacity-50"
        //                         >
        //                             Prev
        //                         </button>

        //                         {paginationButtons}

        //                         <button
        //                             onClick={() => handlePageChange(page + 1)}
        //                             disabled={page === totalPages}
        //                             className="px-3 py-1 mx-1 rounded bg-gray-900 hover:bg-gray-300 hover:text-black disabled:opacity-50"
        //                         >
        //                             Next
        //                         </button>
        //                         {/* <button
        //                             onClick={() => handlePageChange(totalPages)}
        //                             disabled={page === totalPages}
        //                             className="px-3 py-1 mx-1 rounded bg-gray-900 hover:bg-gray-300 hover:text-black disabled:opacity-50"
        //                         >
        //                             Last
        //                         </button> */}
        //                     </div>
        //                 </>
        //             )}
        //         </div>
        //     </div>
        // </div>
    )
}

