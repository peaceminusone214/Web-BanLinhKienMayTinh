import React from "react";

const NewsSection = ({ articles }) => {
  return (
    <section className="section-news" id="js-article-2-container">
      <div className="container news box-article-footer">
        <div className="box-header-news d-flex align-items-center justify-content-between">
          <div className="wrapper d-flex align-items-center">
            <h4 className="box-heading">TIN TỨC VÀ KẾT NỐI</h4>
          </div>
          <a
            href="/tin-tuc"
            className="color-secondary box-sub-heading btn-view-more font-weight-500 text-16 hover-primary"
          >
            XEM TẤT CẢ +
          </a>
        </div>

        <div className="box-content article-content">
          <ul
            className="grid grid--4-cols list-style-none"
            id="js-article-holder"
          >
            {articles.map((article) => (
              <li key={article.id} className="article-item">
                <a href={article.link} className="article-img">
                  <img src={article.img} alt={article.title} />
                  <span className="date">{article.date}</span>
                </a>
                <div className="article-content">
                  <a
                    href={article.link}
                    className="article-name line-clamp-2 font-weight-600"
                  >
                    <h3 className="article-title">{article.title}</h3>
                  </a>
                  <p className="article-description line-clamp-2">
                    {article.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
