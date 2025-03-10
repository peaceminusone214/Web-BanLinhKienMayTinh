import React from "react";

function Chatmessages() {
  return (
    <div>
      <>
        <div className="sherah-body-area">
          {/* sherah Dashboard */}
          <section className="sherah-adashboard sherah-show">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="sherah-body">
                    {/* Dashboard Inner */}
                    <div className="sherah-dsinner">
                      <div className="sherah-breadcrumb mg-top-30">
                        <h2 className="sherah-breadcrumb__title">Message</h2>
                        <ul className="sherah-breadcrumb__list">
                          <li>
                            <a href="#">Home</a>
                          </li>
                          <li className="active">
                            <a href="chat-messages.html">Message</a>
                          </li>
                        </ul>
                      </div>
                      <div className="sherah-chatbox__main">
                        {/* End All Notification Heading */}
                        <div className="sherah-chatbox">
                          <div className="row">
                            <div className="col-lg-3 col-md-3 col-12 sherah-chatbox__one mg-top-30">
                              <div className="sherah-chatbox__sidebar sherah-default-bg sherah-border">
                                <div className="sherah-chatbox__top">
                                  <div className="sherah-chatbox__inner sherah-border-btm pd-btm-20 mg-btm-10">
                                    <div className="sherah-chatbox__author">
                                      <div className="sherah-chatbox__author-img sherah-chatbox__author-img-sticky">
                                        <img
                                          src="/assets/interface-dashboard/img/chat-author10.png"
                                          alt="#"
                                        />
                                        <span className="sherah-chatbox__author-online" />
                                      </div>
                                      <div className="sherah-chatbox__author-content">
                                        <h4 className="sherah-chatbox__author-title">
                                          Brotherhood
                                        </h4>
                                        <p className="sherah-chatbox__author-desc">
                                          Available
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <form
                                    className="sherah-chatbox-form"
                                    action="#"
                                  >
                                    <input
                                      name="s"
                                      defaultValue=""
                                      type="text"
                                      placeholder="Search"
                                    />
                                    <button
                                      className="search-btn"
                                      type="submit"
                                    >
                                      <svg
                                        className="sherah-color1__fill"
                                        width={16}
                                        height={16}
                                        viewBox="0 0 24 25"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M15.6888 18.2542C10.5721 22.0645 4.46185 20.044 1.80873 16.2993C-0.984169 12.3585 -0.508523 7.01726 2.99926 3.64497C6.41228 0.362739 11.833 0.112279 15.5865 3.01273C19.3683 5.93475 20.8252 11.8651 17.3212 16.5826C17.431 16.6998 17.5417 16.8246 17.6599 16.9437C19.6263 18.9117 21.5973 20.8751 23.56 22.8468C24.3105 23.601 24.0666 24.7033 23.104 24.9575C22.573 25.0972 22.1724 24.8646 21.8075 24.4988C19.9218 22.6048 18.0276 20.7194 16.1429 18.8245C15.9674 18.65 15.8314 18.4361 15.6888 18.2542ZM2.39508 10.6363C2.38758 14.6352 5.61109 17.8742 9.62079 17.8977C13.6502 17.9212 16.9018 14.6914 16.9093 10.6597C16.9169 6.64673 13.7046 3.41609 9.69115 3.39921C5.66457 3.38232 2.40259 6.61672 2.39508 10.6363Z" />
                                      </svg>
                                    </button>
                                  </form>
                                </div>
                                {/* Chatbox List */}
                                <ul className="sherah-chatbox__list">
                                  {/* Single List */}
                                  <li>
                                    <div className="sherah-chatbox__inner">
                                      <div className="sherah-chatbox__author">
                                        <div className="sherah-chatbox__author-img">
                                          <img
                                            src="/assets/interface-dashboard/img/chat-author1.png"
                                            alt="#"
                                          />
                                          <span className="sherah-chatbox__author-online" />
                                        </div>
                                        <div className="sherah-chatbox__author-content">
                                          <h4 className="sherah-chatbox__author-title">
                                            Jamen Oliver
                                          </h4>
                                          <p className="sherah-chatbox__author-desc">
                                            Hey! You forgot your keys....
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  {/* End Single List */}
                                  {/* Single List */}
                                  <li>
                                    <div className="sherah-chatbox__inner">
                                      <div className="sherah-chatbox__author">
                                        <div className="sherah-chatbox__author-img">
                                          <img
                                            src="/assets/interface-dashboard/img/chat-author2.png"
                                            alt="#"
                                          />
                                          <span className="sherah-chatbox__author-online author-not-online" />
                                        </div>
                                        <div className="sherah-chatbox__author-content">
                                          <h4 className="sherah-chatbox__author-title">
                                            Orian Heho
                                          </h4>
                                          <p className="sherah-chatbox__author-desc">
                                            How are you?
                                          </p>
                                        </div>
                                      </div>
                                      <div className="sherah-chatbox__right">
                                        <span className="sherah-chatbox__unread sherah-color1__bg">
                                          5
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                  {/* End Single List */}
                                  {/* Single List */}
                                  <li>
                                    <div className="sherah-chatbox__inner">
                                      <div className="sherah-chatbox__author">
                                        <div className="sherah-chatbox__author-img">
                                          <img
                                            src="/assets/interface-dashboard/img/chat-author3.png"
                                            alt="#"
                                          />
                                          <span className="sherah-chatbox__author-online author-not-online" />
                                        </div>
                                        <div className="sherah-chatbox__author-content">
                                          <h4 className="sherah-chatbox__author-title">
                                            Brotherhood
                                          </h4>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  {/* End Single List */}
                                  {/* Single List */}
                                  <li>
                                    <div className="sherah-chatbox__inner">
                                      <div className="sherah-chatbox__author">
                                        <div className="sherah-chatbox__author-img">
                                          <img
                                            src="/assets/interface-dashboard/img/chat-author4.png"
                                            alt="#"
                                          />
                                          <span className="sherah-chatbox__author-online" />
                                        </div>
                                        <div className="sherah-chatbox__author-content">
                                          <h4 className="sherah-chatbox__author-title">
                                            Rose Rovert
                                          </h4>
                                          <p className="sherah-chatbox__author-desc">
                                            Of course I work the finaly done
                                            ....
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  {/* End Single List */}
                                  {/* Single List */}
                                  <li>
                                    <div className="sherah-chatbox__inner">
                                      <div className="sherah-chatbox__author">
                                        <div className="sherah-chatbox__author-img">
                                          <img
                                            src="/assets/interface-dashboard/img/chat-author5.png"
                                            alt="#"
                                          />
                                          <span className="sherah-chatbox__author-online author-is-busy" />
                                        </div>
                                        <div className="sherah-chatbox__author-content">
                                          <h4 className="sherah-chatbox__author-title">
                                            Mahstai
                                          </h4>
                                          <p className="sherah-chatbox__author-desc">
                                            Any plan for today?
                                          </p>
                                        </div>
                                      </div>
                                      <div className="sherah-chatbox__right">
                                        <span className="sherah-chatbox__unread sherah-color1__bg">
                                          7
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                  {/* End Single List */}
                                  {/* Single List */}
                                  <li>
                                    <div className="sherah-chatbox__inner">
                                      <div className="sherah-chatbox__author">
                                        <div className="sherah-chatbox__author-img">
                                          <img
                                            src="/assets/interface-dashboard/img/chat-author6.png"
                                            alt="#"
                                          />
                                          <span className="sherah-chatbox__author-online" />
                                        </div>
                                        <div className="sherah-chatbox__author-content">
                                          <h4 className="sherah-chatbox__author-title">
                                            Thlatics Han
                                          </h4>
                                          <p className="sherah-chatbox__author-desc">
                                            Typing....
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  {/* End Single List */}
                                  {/* Single List */}
                                  <li>
                                    <div className="sherah-chatbox__inner">
                                      <div className="sherah-chatbox__author">
                                        <div className="sherah-chatbox__author-img">
                                          <img
                                            src="/assets/interface-dashboard/img/chat-author7.png"
                                            alt="#"
                                          />
                                          <span className="sherah-chatbox__author-online author-not-online" />
                                        </div>
                                        <div className="sherah-chatbox__author-content">
                                          <h4 className="sherah-chatbox__author-title">
                                            Atlamtan Jhon
                                          </h4>
                                          <p className="sherah-chatbox__author-desc">
                                            Sent to your all files a ....
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  {/* End Single List */}
                                  {/* Single List */}
                                  <li>
                                    <div className="sherah-chatbox__inner">
                                      <div className="sherah-chatbox__author">
                                        <div className="sherah-chatbox__author-img">
                                          <img
                                            src="/assets/interface-dashboard/img/chat-author8.png"
                                            alt="#"
                                          />
                                          <span className="sherah-chatbox__author-online author-is-busy" />
                                        </div>
                                        <div className="sherah-chatbox__author-content">
                                          <h4 className="sherah-chatbox__author-title">
                                            Nitanman
                                          </h4>
                                          <p className="sherah-chatbox__author-desc">
                                            Hi! How are you?
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  {/* End Single List */}
                                  {/* Single List */}
                                  <li>
                                    <div className="sherah-chatbox__inner">
                                      <div className="sherah-chatbox__author">
                                        <div className="sherah-chatbox__author-img">
                                          <img
                                            src="/assets/interface-dashboard/img/chat-author9.png"
                                            alt="#"
                                          />
                                          <span className="sherah-chatbox__author-online" />
                                        </div>
                                        <div className="sherah-chatbox__author-content">
                                          <h4 className="sherah-chatbox__author-title">
                                            Hanmaram
                                          </h4>
                                          <p className="sherah-chatbox__author-desc">
                                            Let's go on the way.
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                  {/* End Single List */}
                                </ul>
                              </div>
                            </div>
                            <div className="col-lg-8 col-md-8 col-12  sherah-chatbox__two mg-top-30">
                              <div className="sherah-chatbox__explore sherah-default-bg sherah-border">
                                <div className="sherah-chatbox__explore-head sherah-border-btm">
                                  <div className="sherah-chatbox__author">
                                    <div className="sherah-chatbox__author-img sherah-chatbox__author-img-sticky">
                                      <img src="/assets/interface-dashboard/img/chat-top-ms.png" alt="#" />
                                      <span className="sherah-chatbox__author-online" />
                                    </div>
                                    <div className="sherah-chatbox__heading">
                                      <h4 className="sherah-chatbox__heading--title">
                                        Hastamjaian
                                      </h4>
                                      <p className="sherah-chatbox__heading--text sherah-pcolor">
                                        Available
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="sherah-chatbox__explore-body">
                                  {/* Incomming List */}
                                  <div className="sherah-chatbox__incoming">
                                    <ul className="sherah-chatbox__incoming-list">
                                      {/* Single Incoming */}
                                      <li>
                                        <div className="sherah-chatbox__chat">
                                          <div className="sherah-chatbox__author-img sherah-chatbox__author-img-sticky">
                                            <img
                                              src="/assets/interface-dashboard/img/chat-author10.png"
                                              alt="#"
                                            />
                                            <span className="sherah-chatbox__author-online" />
                                          </div>
                                          <div className="sherah-chatbox__main-content">
                                            <div className="sherah-chatbox__incoming-chat">
                                              <p className="sherah-chatbox__incoming-text">
                                                Hey, Marshall! How are you? Can
                                                you please and change the color
                                                themei of the website to pink. I
                                                Can you as please change the
                                                color a theme of the website to
                                                pink and purple?
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                      {/* End Single Incoming */}
                                    </ul>
                                  </div>
                                  {/* End Incomming List */}
                                  {/* Outgoing List */}
                                  <div className="sherah-chatbox__incoming sherah-chatbox__outgoing">
                                    <ul className="sherah-chatbox__incoming-list">
                                      {/* Single Incoming */}
                                      <li>
                                        <div className="sherah-chatbox__chat">
                                          <div className="sherah-chatbox__main-content">
                                            <div className="sherah-chatbox__incoming-chat">
                                              <p className="sherah-chatbox__incoming-text">
                                                Send me the files please.
                                              </p>
                                            </div>
                                          </div>
                                          <div className="sherah-chatbox__author-img sherah-chatbox__author-img-sticky">
                                            <img
                                              src="/assets/interface-dashboard/img/chat-top-ms.png"
                                              alt="#"
                                            />
                                            <span className="sherah-chatbox__author-online" />
                                          </div>
                                        </div>
                                      </li>
                                      {/* End Single Incoming */}
                                      {/* Single Incoming */}
                                      <li>
                                        <div className="sherah-chatbox__chat">
                                          <div className="sherah-chatbox__main-content">
                                            <div className="sherah-chatbox__incoming-chat">
                                              <p className="sherah-chatbox__incoming-text">
                                                Can you please change the color
                                                theme the website.
                                              </p>
                                            </div>
                                          </div>
                                          <div className="sherah-chatbox__author-img sherah-chatbox__author-img-sticky">
                                            <img
                                              src="/assets/interface-dashboard/img/chat-top-ms.png"
                                              alt="#"
                                            />
                                            <span className="sherah-chatbox__author-online" />
                                          </div>
                                        </div>
                                      </li>
                                      {/* End Single Incoming */}
                                    </ul>
                                  </div>
                                  {/* End Outgoing List */}
                                  {/* Incomming List */}
                                  <div className="sherah-chatbox__incoming">
                                    <ul className="sherah-chatbox__incoming-list">
                                      {/* Single Incoming */}
                                      <li>
                                        <div className="sherah-chatbox__chat">
                                          <div className="sherah-chatbox__author-img sherah-chatbox__author-img-sticky">
                                            <img
                                              src="/assets/interface-dashboard/img/chat-author10.png"
                                              alt="#"
                                            />
                                            <span className="sherah-chatbox__author-online" />
                                          </div>
                                          <div className="sherah-chatbox__main-content">
                                            <div className="sherah-chatbox__incoming-chat">
                                              <p className="sherah-chatbox__incoming-text">
                                                In computer programming, a
                                                comment is a progriammer as
                                                readable explanation or
                                                annotatons source code of a
                                                computer program They are added
                                                a our the purpose of making the
                                                source as code easier for humans
                                                to understand, and are generally
                                                ignored.There are many
                                                variations of passages of Lorem
                                                asIpsum available, but the
                                                majority have suffered
                                                alteration in some form.
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                      {/* End Single Incoming */}
                                      {/* Single Incoming */}
                                      <li>
                                        <div className="sherah-chatbox__chat">
                                          <div className="sherah-chatbox__author-img sherah-chatbox__author-img-sticky">
                                            <img
                                              src="/assets/interface-dashboard/img/chat-author10.png"
                                              alt="#"
                                            />
                                            <span className="sherah-chatbox__author-online" />
                                          </div>
                                          <div className="sherah-chatbox__main-content">
                                            <div className="sherah-chatbox__incoming-chat">
                                              <p className="sherah-chatbox__incoming-text">
                                                They are added with the purpose
                                                of making the source.
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                      {/* End Single Incoming */}
                                    </ul>
                                  </div>
                                  {/* End Incomming List */}
                                  {/* Outgoing List */}
                                  <div className="sherah-chatbox__incoming sherah-chatbox__outgoing">
                                    <ul className="sherah-chatbox__incoming-list">
                                      {/* Single Incoming */}
                                      <li>
                                        <div className="sherah-chatbox__chat">
                                          <div className="sherah-chatbox__main-content">
                                            <div className="sherah-chatbox__incoming-chat">
                                              <p className="sherah-chatbox__incoming-text">
                                                Mention of something that
                                                deserves
                                              </p>
                                              <ul className="sherah-chatbox__imoji">
                                                <li>
                                                  <img
                                                    src="/assets/interface-dashboard/img/imoji.png"
                                                    alt="#"
                                                  />
                                                </li>
                                                <li>
                                                  <img
                                                    src="/assets/interface-dashboard/img/imoji.png"
                                                    alt="#"
                                                  />
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                          <div className="sherah-chatbox__author-img sherah-chatbox__author-img-sticky">
                                            <img
                                              src="/assets/interface-dashboard/img/chat-top-ms.png"
                                              alt="#"
                                            />
                                            <span className="sherah-chatbox__author-online" />
                                          </div>
                                        </div>
                                      </li>
                                      {/* End Single Incoming */}
                                    </ul>
                                  </div>
                                  {/* End Outgoing List */}
                                  {/* Sherah Message Box  */}
                                  <div className="sherah-chatbox__new-message">
                                    <div className="sherah-chatbox__form">
                                      <form
                                        className="sherah-chatbox__form-inner"
                                        action="#"
                                      >
                                        <div className="sherah-chatbox__button sherah-chatbox__v1">
                                          <a href="#">
                                            <svg
                                              className="sherah-offset__fill"
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="26.297"
                                              height="26.327"
                                              viewBox="0 0 26.297 26.327"
                                            >
                                              <g
                                                id="Icon"
                                                transform="translate(-0.344 -0.001)"
                                              >
                                                <g
                                                  id="_x34__17_"
                                                  transform="translate(0.343 0.001)"
                                                >
                                                  <g
                                                    id="Group_20"
                                                    data-name="Group 20"
                                                    transform="translate(0 0)"
                                                  >
                                                    <path
                                                      id="Path_210"
                                                      data-name="Path 210"
                                                      d="M25.3,9.583,11.924,22.815a5.722,5.722,0,0,1-8.029,0,5.57,5.57,0,0,1,0-7.939L15.938,2.967a3.815,3.815,0,0,1,5.352,0,3.713,3.713,0,0,1,0,5.293L9.247,20.168a1.907,1.907,0,0,1-2.676,0,1.857,1.857,0,0,1,0-2.646l10.7-10.585L15.937,5.614,5.234,16.2a3.713,3.713,0,0,0,0,5.293,3.815,3.815,0,0,0,5.352,0L22.628,9.584a5.57,5.57,0,0,0,0-7.939,5.722,5.722,0,0,0-8.029,0L1.888,14.215l.046.046a7.42,7.42,0,0,0,.623,9.878,7.628,7.628,0,0,0,9.989.616l.046.046L26.641,10.908Z"
                                                      transform="translate(-0.343 -0.001)"
                                                    />
                                                  </g>
                                                </g>
                                              </g>
                                            </svg>
                                          </a>
                                        </div>
                                        <input
                                          name="s"
                                          defaultValue=""
                                          type="text"
                                          placeholder="Type your message...."
                                        />
                                        <div className="sherah-chatbox__button">
                                          <div className="sherah-chatbox__button-inline">
                                            <div className="sherah-chatbox__btn sherah-chatbox__record">
                                              <a href="#">
                                                <svg
                                                  className="sherah-offset__fill"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="14.586"
                                                  height="24.076"
                                                  viewBox="0 0 14.586 24.076"
                                                >
                                                  <g
                                                    id="mic"
                                                    transform="translate(-95.922)"
                                                  >
                                                    <g
                                                      id="Group_22"
                                                      data-name="Group 22"
                                                      transform="translate(99.129)"
                                                    >
                                                      <g
                                                        id="Group_21"
                                                        data-name="Group 21"
                                                      >
                                                        <path
                                                          id="Path_215"
                                                          data-name="Path 215"
                                                          d="M170.393,0a4.091,4.091,0,0,0-4.086,4.086v8.031a4.087,4.087,0,0,0,8.173.028V4.086A4.091,4.091,0,0,0,170.393,0Zm2.384,12.146a2.384,2.384,0,0,1-4.767-.028V4.086a2.384,2.384,0,1,1,4.767,0Z"
                                                          transform="translate(-166.307)"
                                                        />
                                                      </g>
                                                    </g>
                                                    <g
                                                      id="Group_24"
                                                      data-name="Group 24"
                                                      transform="translate(102.364 19.394)"
                                                    >
                                                      <g
                                                        id="Group_23"
                                                        data-name="Group 23"
                                                      >
                                                        <rect
                                                          id="Rectangle_38"
                                                          data-name="Rectangle 38"
                                                          width="1.703"
                                                          height="3.831"
                                                        />
                                                      </g>
                                                    </g>
                                                    <g
                                                      id="Group_26"
                                                      data-name="Group 26"
                                                      transform="translate(100.122 22.373)"
                                                    >
                                                      <g
                                                        id="Group_25"
                                                        data-name="Group 25"
                                                      >
                                                        <path
                                                          id="Path_216"
                                                          data-name="Path 216"
                                                          d="M193.442,474.628h-4.484a.851.851,0,1,0,0,1.7h4.484a.851.851,0,0,0,0-1.7Z"
                                                          transform="translate(-188.107 -474.628)"
                                                        />
                                                      </g>
                                                    </g>
                                                    <g
                                                      id="Group_28"
                                                      data-name="Group 28"
                                                      transform="translate(95.922 11.251)"
                                                    >
                                                      <g
                                                        id="Group_27"
                                                        data-name="Group 27"
                                                      >
                                                        <path
                                                          id="Path_217"
                                                          data-name="Path 217"
                                                          d="M109.657,234.822a.851.851,0,0,0-.851.851v.681a5.591,5.591,0,0,1-11.181,0v-.681a.851.851,0,0,0-1.7,0v.681a7.293,7.293,0,1,0,14.586,0v-.681A.851.851,0,0,0,109.657,234.822Z"
                                                          transform="translate(-95.922 -234.822)"
                                                        />
                                                      </g>
                                                    </g>
                                                  </g>
                                                </svg>
                                              </a>
                                            </div>
                                            <div className="sherah-chatbox__btn sherah-chatbox__imoji">
                                              <a href="#">
                                                <svg
                                                  className="sherah-offset__fill"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width={25}
                                                  height={25}
                                                  viewBox="0 0 25 25"
                                                >
                                                  <path
                                                    id="smile"
                                                    d="M12.5,25A12.5,12.5,0,0,1,3.661,3.661,12.5,12.5,0,0,1,21.339,21.339,12.419,12.419,0,0,1,12.5,25Zm0-23.047A10.547,10.547,0,1,0,23.047,12.5,10.559,10.559,0,0,0,12.5,1.953Zm4.577,12.7a.976.976,0,0,0-1.348.3,4.3,4.3,0,0,1-3.278,1.891,4.3,4.3,0,0,1-3.278-1.891.977.977,0,0,0-1.648,1.049,6.279,6.279,0,0,0,4.925,2.8,6.278,6.278,0,0,0,4.925-2.8.977.977,0,0,0-.3-1.348ZM8.2,8.057A1.221,1.221,0,1,1,6.982,9.277,1.221,1.221,0,0,1,8.2,8.057Zm7.324,1.221a1.221,1.221,0,1,0,1.221-1.221A1.221,1.221,0,0,0,15.527,9.277Z"
                                                  />
                                                </svg>
                                              </a>
                                            </div>
                                            <div className="sherah-chatbox__btn sherah-chatbox__image">
                                              <a href="#">
                                                <svg
                                                  className="sherah-offset__fill"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="26.725"
                                                  height="24.498"
                                                  viewBox="0 0 26.725 24.498"
                                                >
                                                  <g
                                                    id="image1"
                                                    transform="translate(0 -0.492)"
                                                  >
                                                    <path
                                                      id="Path_211"
                                                      data-name="Path 211"
                                                      d="M19.713,185.735a2.524,2.524,0,0,1-.638-.082l-17.22-4.611a2.528,2.528,0,0,1-1.773-3.068l1.893-7.259a.835.835,0,0,1,1.616.422L1.7,178.4a.85.85,0,0,0,.595,1.032l17.21,4.609a.83.83,0,0,0,1.014-.586l.588-2.372a.835.835,0,0,1,1.621.4l-.59,2.383a2.508,2.508,0,0,1-2.423,1.871Zm0,0"
                                                      transform="translate(0 -160.744)"
                                                    />
                                                    <path
                                                      id="Path_212"
                                                      data-name="Path 212"
                                                      d="M105.086,18.309H87.825A2.508,2.508,0,0,1,85.32,15.8V3A2.508,2.508,0,0,1,87.825.492h17.26A2.508,2.508,0,0,1,107.591,3V15.8A2.508,2.508,0,0,1,105.086,18.309ZM87.825,2.162A.835.835,0,0,0,86.99,3V15.8a.835.835,0,0,0,.835.835h17.26a.835.835,0,0,0,.835-.835V3a.835.835,0,0,0-.835-.835Zm0,0"
                                                      transform="translate(-80.866 0)"
                                                    />
                                                    <path
                                                      id="Path_213"
                                                      data-name="Path 213"
                                                      d="M151.547,68.946a2.227,2.227,0,1,1,2.227-2.227A2.229,2.229,0,0,1,151.547,68.946Zm0-2.784a.557.557,0,1,0,.557.557A.557.557,0,0,0,151.547,66.162Zm0,0"
                                                      transform="translate(-141.526 -60.659)"
                                                    />
                                                    <path
                                                      id="Path_214"
                                                      data-name="Path 214"
                                                      d="M86.589,124.267a.836.836,0,0,1-.59-1.426l5.033-5.033a1.954,1.954,0,0,1,2.762,0l1.346,1.346,4.136-4.964a1.948,1.948,0,0,1,1.488-.7,1.791,1.791,0,0,1,1.493.685l5.543,6.467a.836.836,0,0,1-1.268,1.088l-5.545-6.47a.334.334,0,0,0-.214-.1.28.28,0,0,0-.214.1l-4.721,5.668a.834.834,0,0,1-.6.3.819.819,0,0,1-.628-.244l-1.993-1.993a.241.241,0,0,0-.4,0l-5.033,5.032a.829.829,0,0,1-.59.245Zm0,0"
                                                      transform="translate(-81.277 -107.094)"
                                                    />
                                                  </g>
                                                </svg>
                                              </a>
                                            </div>
                                          </div>
                                          <div className="sherah-chatbox__submit">
                                            <button
                                              className="sherah-chatbox__submit-btn"
                                              type="submit"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18.695"
                                                height="16.249"
                                                viewBox="0 0 18.695 16.249"
                                              >
                                                <g
                                                  id="send"
                                                  transform="translate(-0.001 -33.492)"
                                                >
                                                  <path
                                                    id="Path_218"
                                                    data-name="Path 218"
                                                    d="M18.683,34.156a.548.548,0,0,0-.731-.627L.353,40.247a.548.548,0,0,0,0,1.023L5.3,43.179v6.014a.548.548,0,0,0,1.037.246l2.045-4.058,4.99,3.7a.548.548,0,0,0,.85-.28C18.876,33.53,18.675,34.194,18.683,34.156ZM14.339,36.08,5.765,42.186,2.077,40.761ZM6.391,43.085l7.473-5.322c-6.43,6.784-6.095,6.427-6.123,6.464-.042.056.072-.162-1.35,2.661ZM13.4,47.742,9,44.483,16.945,36.1Z"
                                                    transform="translate(0 0)"
                                                    fill="#fff"
                                                  />
                                                </g>
                                              </svg>
                                              Send
                                            </button>
                                          </div>
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                  {/* End Incomming List */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End Dashboard Inner */}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* End sherah Dashboard */}
        </div>
        {/* sherah Scripts */}
      </>
    </div>
  );
}

export default Chatmessages;
