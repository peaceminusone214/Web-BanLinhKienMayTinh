import React from "react";
import { Link } from "react-router-dom";
import "./styleNews.css";
import "./styleGame.css";

const games = [
  {
    title: "Cấu hình Monster Hunter: Wilds - Game săn quái đỉnh nhất 2025",
    date: "14-02-2025, 10:50 am",
    views: 210,
    comments: 0,
    image: "/assets/interface-main/imgGame/monster-hunter-wilds.jpg",
  },
  {
    title: "Cấu hình Kingdom Come Deliverance 2 - Siêu phẩm game trung cổ 2025",
    date: "23-01-2025, 2:53 pm",
    views: 359,
    comments: 0,
    image: "/assets/interface-main/imgGame/kingdom-come-2.jpg",
  },
  {
    title: "Cấu hình Final Fantasy 7 Rebirth: Khá dễ thở cho game thủ PC",
    date: "21-01-2025, 10:41 am",
    views: 532,
    comments: 0,
    image: "/assets/interface-main/imgGame/final-fantasy-7-rebirth.jpg",
  },
  {
    title: "Cấu hình Assassin's Creed Shadows PC: vừa miếng cho game thủ",
    date: "24-01-2025, 3:05 pm",
    views: 256,
    comments: 0,
    image: "/assets/interface-main/imgGame/assassins-creed-shadows.jpg",
  },
  {
    title: "Cấu hình game Dynasty Warriors: Origins - Siêu phẩm hack & slash của năm",
    date: "18-01-2025, 9:16 am",
    views: 1214,
    comments: 0,
    image: "/assets/interface-main/imgGame/dynasty-warriors-origins.jpg",
  },
  {
    title: "Cấu hình Lost Soul Aside, Không chơi hơi phí",
    date: "31-12-2024, 8:59 am",
    views: 512,
    comments: 0,
    image: "/assets/interface-main/imgGame/lost-soul-aside.jpg",
  },
  {
    title: "Steam Winter Sale 2024: Sự kiện Sale lớn Nhất Cuối Năm Dành Cho Game thủ",
    date: "20-12-2024, 6:43 pm",
    views: 172,
    comments: 0,
    image: "/assets/interface-main/imgGame/steamwinter.jpg",
  },
  {
    title: "Cấu hình Indiana Jones and the Great Circle: Chuẩn mực game benchmark",
    date: "13-12-2024, 10:44 am",
    views: 504,
    comments: 0,
    image: "/assets/interface-main/imgGame/indiana.jpg",
  },
  {
    title: "Cấu hình Path of Exile 2 trên máy tính, PC",
    date: "16-12-2024, 2:20 pm",
    views: 5656,
    comments: 0,
    image: "/assets/interface-main/imgGame/pathofexile2.jpg",
  },
  {
    title: "Cấu hình chơi Marvel Rivals: Game siêu anh hùng HOT nhất 2025",
    date: "17-01-2025, 3:36 pm",
    views: 11027,
    comments: 0,
    image: "/assets/interface-main/imgGame/marvelrivals4.jpg",
  },
  {
    title: "Cấu hình Microsoft Flight Simulator 2024: Rất thật và cũng rất nặng",
    date: "20-11-2024, 1:45 pm",
    views: 900,
    comments: 0,
    image: "/assets/interface-main/imgGame/flightsimulator2024.jpg",
  },
  {
    title: "7 Game giảm sâu đáng mua nhất Halloween Sale trên Steam 2024", 
    date: "29-10-2024, 2:16 pm",
    views: 297,
    comments: 0,
    image: "/assets/interface-main/imgGame/halloweensale.jpg",
  },
];

const Game = () => {
  return (
    <div className="tech-container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span className="current">Chủ đề Game</span>
      </div>
      <nav className="news-categories">
        <Link to="/News/tech">TIN CÔNG NGHỆ</Link>
        <Link to="/News/san-pham">SẢN PHẨM MỚI</Link>
        <Link to="/News/game">CHỦ ĐỀ GAME</Link>
        <Link to="/News/tips">THỦ THUẬT</Link>
        <Link to="/News/software">PHẦN MỀM</Link>
      </nav>
      <div className="game-container">
      {games.map((game, index) => (
        <div key={index} className="game-card">
          <img src={game.image} alt={game.title} />
          <h2>{game.title}</h2>
          <div className="game-meta">
            <span>📅 {game.date}</span>
            <span>💬 {game.comments}</span>
            <span>👁️ {game.views}</span>
          </div>
        </div>
      ))}
    </div>
      </div>
  );
};

export default Game;
