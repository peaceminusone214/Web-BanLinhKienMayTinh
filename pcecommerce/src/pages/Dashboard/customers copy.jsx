import React from "react";

function Customer() {
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
                      <div className="row mg-top-30">
                        <div className="col-12 sherah-flex-between">
                          {/* Sherah Breadcrumb */}
                          <div className="sherah-breadcrumb">
                            <h2 className="sherah-breadcrumb__title">
                              Customers
                            </h2>
                            <ul className="sherah-breadcrumb__list">
                              <li>
                                <a href="#">Home</a>
                              </li>
                              <li className="active">
                                <a href="customers.html">Customers</a>
                              </li>
                            </ul>
                          </div>
                          {/* End Sherah Breadcrumb */}
                          <a href="#" className="sherah-btn sherah-gbcolor">
                            Add customer
                          </a>
                        </div>
                      </div>
                      <div className="sherah-page-inner sherah-border sherah-default-bg mg-top-25 pt-0">
                        <div className="row">
                          <div className="col-lg-3 col-12 mg-top-30">
                            <div className="sherah-upcard">
                              <div className="sherah-upcard__thumb">
                                <img src="/assets/interface-dashboard/img/customer-profile.png" alt="#" />
                              </div>
                              <div className="sherah-upcard__heading">
                                <h3 className="sherah-upcard__title">
                                  Margaret Raw
                                </h3>
                                <p className="sherah-upcard__phone">
                                  +38 (094) 730-24-25
                                </p>
                                <p className="sherah-upcard__email">
                                  <a href="mailto:margaretraw@gmail.com">
                                    margaretraw@gmail.com
                                  </a>
                                </p>
                              </div>
                              <div className="sherah-upcard__balance sherah-default-bg sherah-border">
                                Balance $1200
                              </div>
                              <ul className="sherah-upcard__list mg-top-40">
                                <li>
                                  <b>Last Order</b>
                                  <span>
                                    7 days ago –{" "}
                                    <a className="sherah-color1">#80294</a>
                                  </span>
                                </li>
                                <li>
                                  <b>Average Order Value</b>
                                  <span>$574.00</span>
                                </li>
                                <li>
                                  <b>Last Order</b>
                                  <span>
                                    7 days ago –{" "}
                                    <a className="sherah-color1">#80294</a>
                                  </span>
                                </li>
                                <li>
                                  <b>Email Marketing</b>
                                  <span>Subscribed</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-lg-9 col-12 mg-top-30">
                            <div className="sherah-table__head sherah-table__main">
                              <h4 className="sherah-order-title">Orders</h4>
                              <p className="sherah-order-text">
                                Total spent $85,560.00 on 7 orders
                              </p>
                            </div>
                            <div className="sherah-table p-0">
                              <table
                                id="sherah-table__vendor"
                                className="sherah-table__main sherah-table__main-v3"
                              >
                                <tbody className="sherah-table__body">
                                  <tr>
                                    <td className="sherah-table__column-1 sherah-table__data-1">
                                      <div className="sherah-table__product--id">
                                        <p className="crany-table__product--number">
                                          <a href="#" className="sherah-color1">
                                            #Kz025417
                                          </a>
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-2 sherah-table__data-2">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Today at 4:55 pm
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-3 sherah-table__data-3">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Pending
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          6 items
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-5 sherah-table__data-5">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $520.00
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="sherah-table__column-1 sherah-table__data-1">
                                      <div className="sherah-table__product--id">
                                        <p className="crany-table__product--number">
                                          <a href="#" className="sherah-color1">
                                            #80293
                                          </a>
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-2 sherah-table__data-2">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Today at 4:50 pm
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-3 sherah-table__data-3">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Pending
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          6 items
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-5 sherah-table__data-5">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $985.00
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="sherah-table__column-1 sherah-table__data-1">
                                      <div className="sherah-table__product--id">
                                        <p className="crany-table__product--number">
                                          <a href="#" className="sherah-color1">
                                            #78621
                                          </a>
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-2 sherah-table__data-2">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          November 20, 2021
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-3 sherah-table__data-3">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Completed
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          10 items
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-5 sherah-table__data-5">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $623.00
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="sherah-table__column-1 sherah-table__data-1">
                                      <div className="sherah-table__product--id">
                                        <p className="crany-table__product--number">
                                          <a href="#" className="sherah-color1">
                                            #Kz025417
                                          </a>
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-2 sherah-table__data-2">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Today at 4:55 pm
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-3 sherah-table__data-3">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Pending
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          6 items
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-5 sherah-table__data-5">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $520.00
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="sherah-table__column-1 sherah-table__data-1">
                                      <div className="sherah-table__product--id">
                                        <p className="crany-table__product--number">
                                          <a href="#" className="sherah-color1">
                                            #80293
                                          </a>
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-2 sherah-table__data-2">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Today at 4:50 pm
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-3 sherah-table__data-3">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Pending
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          6 items
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-5 sherah-table__data-5">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $985.00
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="sherah-table__column-1 sherah-table__data-1">
                                      <div className="sherah-table__product--id">
                                        <p className="crany-table__product--number">
                                          <a href="#" className="sherah-color1">
                                            #78621
                                          </a>
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-2 sherah-table__data-2">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          November 20, 2021
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-3 sherah-table__data-3">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Completed
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          10 items
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-5 sherah-table__data-5">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $623.00
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="sherah-table__column-1 sherah-table__data-1">
                                      <div className="sherah-table__product--id">
                                        <p className="crany-table__product--number">
                                          <a href="#" className="sherah-color1">
                                            #Kz025417
                                          </a>
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-2 sherah-table__data-2">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Today at 4:55 pm
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-3 sherah-table__data-3">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Pending
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          6 items
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-5 sherah-table__data-5">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $520.00
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="sherah-table__column-1 sherah-table__data-1">
                                      <div className="sherah-table__product--id">
                                        <p className="crany-table__product--number">
                                          <a href="#" className="sherah-color1">
                                            #80293
                                          </a>
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-2 sherah-table__data-2">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Today at 4:50 pm
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-3 sherah-table__data-3">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          Pending
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          6 items
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-5 sherah-table__data-5">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $985.00
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <a
                              href="#"
                              className="sherah-dropdown-card__sell-all"
                            >
                              View All Orders
                            </a>
                            <div className="row">
                              <div className="col-lg-6 col-md-6 col-12 mg-top-30">
                                <div className="sherah-accounts-card">
                                  {/* Sherah Card Header*/}
                                  <div className="sherah-accounts-card__header sherah-border-btm mg-btm-30 pd-btm-30">
                                    <h3 className="sherah-accounts-card__title">
                                      Account Details
                                    </h3>
                                    <a
                                      href="#"
                                      className="sherah-accounts-card__button"
                                    >
                                      <svg
                                        className="sherah-color3__fill"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={21}
                                        height="21.031"
                                        viewBox="0 0 21 21.031"
                                      >
                                        <g
                                          id="Icon"
                                          transform="translate(-234.958 -37.876)"
                                        >
                                          <path
                                            id="Path_481"
                                            data-name="Path 481"
                                            d="M243.71,98.115h-6.136a2.56,2.56,0,0,1-2.61-2.6c-.01-2.086,0-4.173,0-6.26q0-2.944,0-5.889a2.648,2.648,0,0,1,2.791-2.79q3.356,0,6.713,0c.613,0,1,.316,1.038.825a.855.855,0,0,1-.8.923c-.341.03-.686.016-1.029.017q-2.924,0-5.848,0c-.811,0-1.112.306-1.112,1.127q0,5.909,0,11.819c0,.793.307,1.1,1.091,1.1q5.951,0,11.9,0c.767,0,1.068-.306,1.069-1.077q0-3.356,0-6.712a.882.882,0,0,1,.913-.984.859.859,0,0,1,.835.932c.009,1.18,0,2.361,0,3.542s.014,2.334-.007,3.5a2.578,2.578,0,0,1-1.941,2.467,2.111,2.111,0,0,1-.528.055Q246.881,98.119,243.71,98.115Z"
                                            transform="translate(0 -39.209)"
                                          />
                                          <path
                                            id="Path_482"
                                            data-name="Path 482"
                                            d="M333.733,72.644l3.09,3.089c-.058.062-.138.153-.223.239q-3.246,3.248-6.5,6.489a1.284,1.284,0,0,1-.59.328c-.909.2-1.825.381-2.741.554-.572.108-.766-.106-.651-.68.181-.9.353-1.8.546-2.7a1.052,1.052,0,0,1,.242-.5q3.367-3.389,6.752-6.76A.387.387,0,0,1,333.733,72.644Z"
                                            transform="translate(-83.723 -31.904)"
                                          />
                                          <path
                                            id="Path_483"
                                            data-name="Path 483"
                                            d="M434.126,42.825l-3.133-3.133a18.248,18.248,0,0,1,1.564-1.44,2.176,2.176,0,0,1,2.975,3.071A20.276,20.276,0,0,1,434.126,42.825Z"
                                            transform="translate(-179.988)"
                                          />
                                        </g>
                                      </svg>
                                    </a>
                                  </div>
                                  {/* Sherah Card Body */}
                                  <div className="sherah-accounts-card__body">
                                    <ul className="sherah-accounts-card__list">
                                      <li>
                                        First Name: <span>Margaret</span>
                                      </li>
                                      <li>
                                        Last Name: <span>Raw</span>
                                      </li>
                                      <li>
                                        Date of Birth: <span>15 July 1997</span>
                                      </li>
                                      <li>
                                        Gender: <span>Male</span>
                                      </li>
                                    </ul>
                                  </div>
                                  {/* End Sherah Card Body */}
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6 col-12 mg-top-30">
                                <div className="sherah-accounts-card">
                                  {/* Sherah Card Header*/}
                                  <div className="sherah-accounts-card__header sherah-border-btm mg-btm-30 pd-btm-30">
                                    <h3 className="sherah-accounts-card__title">
                                      Credit Card
                                    </h3>
                                    <a
                                      href="#"
                                      className="sherah-accounts-card__button"
                                    >
                                      <svg
                                        className="sherah-color3__fill"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={21}
                                        height="21.031"
                                        viewBox="0 0 21 21.031"
                                      >
                                        <g
                                          id="Icon"
                                          transform="translate(-234.958 -37.876)"
                                        >
                                          <path
                                            id="Path_481"
                                            data-name="Path 481"
                                            d="M243.71,98.115h-6.136a2.56,2.56,0,0,1-2.61-2.6c-.01-2.086,0-4.173,0-6.26q0-2.944,0-5.889a2.648,2.648,0,0,1,2.791-2.79q3.356,0,6.713,0c.613,0,1,.316,1.038.825a.855.855,0,0,1-.8.923c-.341.03-.686.016-1.029.017q-2.924,0-5.848,0c-.811,0-1.112.306-1.112,1.127q0,5.909,0,11.819c0,.793.307,1.1,1.091,1.1q5.951,0,11.9,0c.767,0,1.068-.306,1.069-1.077q0-3.356,0-6.712a.882.882,0,0,1,.913-.984.859.859,0,0,1,.835.932c.009,1.18,0,2.361,0,3.542s.014,2.334-.007,3.5a2.578,2.578,0,0,1-1.941,2.467,2.111,2.111,0,0,1-.528.055Q246.881,98.119,243.71,98.115Z"
                                            transform="translate(0 -39.209)"
                                          />
                                          <path
                                            id="Path_482"
                                            data-name="Path 482"
                                            d="M333.733,72.644l3.09,3.089c-.058.062-.138.153-.223.239q-3.246,3.248-6.5,6.489a1.284,1.284,0,0,1-.59.328c-.909.2-1.825.381-2.741.554-.572.108-.766-.106-.651-.68.181-.9.353-1.8.546-2.7a1.052,1.052,0,0,1,.242-.5q3.367-3.389,6.752-6.76A.387.387,0,0,1,333.733,72.644Z"
                                            transform="translate(-83.723 -31.904)"
                                          />
                                          <path
                                            id="Path_483"
                                            data-name="Path 483"
                                            d="M434.126,42.825l-3.133-3.133a18.248,18.248,0,0,1,1.564-1.44,2.176,2.176,0,0,1,2.975,3.071A20.276,20.276,0,0,1,434.126,42.825Z"
                                            transform="translate(-179.988)"
                                          />
                                        </g>
                                      </svg>
                                    </a>
                                  </div>
                                  {/* Sherah Card Body */}
                                  <div className="sherah-accounts-card__body">
                                    <ul className="sherah-accounts-card__list">
                                      <li>
                                        Card Type: <span>VISA</span>
                                      </li>
                                      <li>
                                        Card Holder: <span>Margaret Raw</span>
                                      </li>
                                      <li>
                                        Expire: <span>20 May 2026</span>
                                      </li>
                                      <li>
                                        Card Number:{" "}
                                        <span>5698 5236 3288 7766</span>
                                      </li>
                                      <li>
                                        Balance: <span>1200</span>
                                      </li>
                                    </ul>
                                  </div>
                                  {/* End Sherah Card Body */}
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

export default Customer;
