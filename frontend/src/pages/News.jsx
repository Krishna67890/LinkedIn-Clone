import React, { useState, useEffect } from 'react';
import { FaRegBookmark, FaShareAlt, FaEllipsisH } from 'react-icons/fa';
import { useUserData } from '../context/UserContext';
import Nav from '../components/Nav';

function News() {
  const { userData } = useUserData();
  const [trendingNews, setTrendingNews] = useState([]);

  // Generate random LinkedIn-style news
  const generateRandomNews = () => {
    const newsTitles = [
      "Remote work trends in 2024 reshape corporate culture",
      "AI transforming industries: What it means for your career",
      "Sustainable business practices gain momentum globally",
      "Blockchain adoption accelerates in financial services",
      "Cybersecurity threats evolve with new remote work models",
      "Quantum computing breakthrough promises revolutionary changes",
      "Green energy investments surge amid climate concerns",
      "Digital nomad lifestyle becomes mainstream among professionals",
      "5G networks expand globally enabling new technologies",
      "Cryptocurrency market volatility creates investment opportunities",
      "E-commerce sales hit record highs during holiday season",
      "Cloud computing cost optimization strategies for startups",
      "Machine learning in healthcare improves patient outcomes",
      "Remote collaboration tools evolve for hybrid teams",
      "Data privacy regulations tighten worldwide",
      "Startup funding reaches new heights in tech sector",
      "Women in leadership roles increase across Fortune 500",
      "Mental health awareness grows in workplace environments",
      "Gig economy expands with new platform opportunities",
      "Virtual reality training transforms employee onboarding"
    ];

    const newsDescriptions = [
      "How companies are adapting to hybrid models and what it means for employees seeking flexibility in their careers.",
      "Latest developments in artificial intelligence and how businesses are integrating AI to enhance productivity and decision-making.",
      "Companies leading in environmental initiatives and sustainable practices that are setting new industry standards.",
      "New applications in finance and supply chain management showing significant benefits for early adopters.",
      "Protecting digital assets in the modern era with evolving threat landscapes and security measures.",
      "Potential to revolutionize computing power and solve complex problems previously thought impossible.",
      "Renewable sources driving economic growth while reducing carbon footprints across multiple sectors.",
      "Work-life balance in the digital age with professionals exploring location independence and flexible schedules.",
      "Faster connectivity enabling Internet of Things (IoT) devices and smart city infrastructure development.",
      "Market fluctuations impact investor strategies with new digital currencies gaining institutional adoption.",
      "Online shopping continues exponential growth with mobile commerce leading the charge in emerging markets.",
      "Efficient resource management in cloud environments helping startups reduce operational costs significantly.",
      "Diagnostic tools improving patient outcomes through early detection and personalized treatment plans.",
      "Virtual meetings become more immersive with spatial audio and holographic technology integrations.",
      "Compliance challenges for global businesses navigating varying regional data protection requirements.",
      "Venture capital firms show increased interest in Series A and B funding rounds for innovative startups.",
      "Corporate diversity initiatives show measurable progress in executive representation and board composition.",
      "Organizations implement comprehensive wellness programs addressing stress and burnout prevention strategies.",
      "Independent contractors find new opportunities through specialized platforms connecting talent with projects.",
      "Training simulations enhance skill development while reducing costs associated with traditional learning methods."
    ];

    const newsCategories = [
      "Technology", "Business", "Career", "Innovation", 
      "Leadership", "Finance", "Healthcare", "Environment",
      "Education", "Startups", "Security", "Remote Work"
    ];

    const news = [];
    // Generate 10 random news items
    for (let i = 0; i < 10; i++) {
      const randomTitleIndex = Math.floor(Math.random() * newsTitles.length);
      const randomDescIndex = Math.floor(Math.random() * newsDescriptions.length);
      const randomCategoryIndex = Math.floor(Math.random() * newsCategories.length);
      
      // Generate random time (1-24 hours ago)
      const randomHours = Math.floor(Math.random() * 24) + 1;
      
      // Generate random readers count (1,000-100,000)
      const randomReaders = Math.floor(Math.random() * 99000) + 1000;
      
      // Generate random engagement metrics
      const randomLikes = Math.floor(Math.random() * 5000) + 100;
      const randomComments = Math.floor(Math.random() * 500) + 10;
      const randomShares = Math.floor(Math.random() * 300) + 5;

      news.push({
        id: Date.now() + i, // Unique ID
        title: newsTitles[randomTitleIndex],
        description: newsDescriptions[randomDescIndex],
        category: newsCategories[randomCategoryIndex],
        time: `${randomHours}h ago`,
        readers: randomReaders.toLocaleString(),
        likes: randomLikes,
        comments: randomComments,
        shares: randomShares,
        trending: randomHours < 6 // Mark as trending if posted within 6 hours
      });
    }

    // Sort by time (newest first)
    news.sort((a, b) => {
      const timeA = parseInt(a.time);
      const timeB = parseInt(b.time);
      return timeA - timeB;
    });

    setTrendingNews(news);
  };

  // Initialize news and set up interval for updates
  useEffect(() => {
    // Generate initial news
    generateRandomNews();

    // Update news every 2 seconds
    const newsInterval = setInterval(() => {
      generateRandomNews();
    }, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(newsInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn News</h1>
          <p className="text-gray-600">Stay updated with the latest professional news and insights</p>
        </div>

        {/* News Feed */}
        <div className="space-y-6">
          {trendingNews.map((newsItem) => (
            <div key={newsItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Category and Time */}
                <div className="flex justify-between items-center mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {newsItem.category}
                  </span>
                  <span className="text-sm text-gray-500">{newsItem.time}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                  {newsItem.title}
                </h2>

                {/* Description */}
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {newsItem.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{newsItem.readers} readers</span>
                  {newsItem.trending && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Trending
                    </span>
                  )}
                </div>

                {/* Engagement Metrics */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-6">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                      <span className="text-sm">👍</span>
                      <span className="text-sm">{newsItem.likes.toLocaleString()}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                      <span className="text-sm">💬</span>
                      <span className="text-sm">{newsItem.comments.toLocaleString()}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                      <span className="text-sm">🔄</span>
                      <span className="text-sm">{newsItem.shares.toLocaleString()}</span>
                    </button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="text-gray-500 hover:text-blue-600">
                      <FaRegBookmark className="w-5 h-5" />
                    </button>
                    <button className="text-gray-500 hover:text-blue-600">
                      <FaShareAlt className="w-5 h-5" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <FaEllipsisH className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>News updates every 2 seconds • {trendingNews.length} articles</p>
        </div>
      </div>
    </div>
  );
}

export default News;