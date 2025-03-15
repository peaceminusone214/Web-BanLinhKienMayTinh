import React from "react";

function Invoiceprint() {
  return (
    <div>
      <>
        <div className="sherah-body-area">
          {/* sherah Dashboard */}
          <section>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="sherah-body">
                    {/* Dashboard Inner */}
                    <div className="sherah-dsinner">
                      <div className="sherah-page-inner sherah-default-bg mg-top-25">
                        <div className="sherah-invoice-header">
                          <a href="index.html">
                            {" "}
                            <img
                              className="sherah-logo__main"
                              src="/assets/interface-dashboard/img/logo.png"
                              alt="#"
                            />
                          </a>
                          <p>
                            Invoice | <a href="#">Sherah</a> - Admin Dashboard
                            Template
                          </p>
                          <p className="sherah-invoice-header__id text-end">
                            <span className="sherah-color1">
                              Order #BD80288
                            </span>
                            <span className="d-block">
                              November 02, 2022 <small>01 : 30 PM</small>
                            </span>
                          </p>
                        </div>
                        {/* Sherah Invoice */}
                        <div className="sherah-invoice-form mg-btm-70">
                          <div className="sherah-invoice-form__first  sherah-invoice-form__first--print">
                            <div className="sherah-invoice-form__single">
                              <h4 className="sherah-invoice-form__title">
                                Billed To:{" "}
                              </h4>
                              <p className="sherah-invoice-form__text">
                                John Smith
                              </p>
                              <p className="sherah-invoice-form__text">
                                Apt. 4B
                              </p>
                              <p className="sherah-invoice-form__text">
                                Springfield, ST 54321
                              </p>
                            </div>
                            <div className="sherah-invoice-form__single sherah-invoice-form__single--right">
                              <h4 className="sherah-invoice-form__title">
                                Shipped To:
                              </h4>
                              <p className="sherah-invoice-form__text">
                                Kenny Rigdon
                              </p>
                              <p className="sherah-invoice-form__text">
                                1234 Main
                              </p>
                              <p className="sherah-invoice-form__text">
                                Apt. 4B
                              </p>
                              <p className="sherah-invoice-form__text">
                                Springfield, ST 54321
                              </p>
                            </div>
                          </div>
                          <div className="sherah-invoice-form__first sherah-invoice-form__first--print">
                            <div className="sherah-invoice-form__single">
                              <h4 className="sherah-invoice-form__title">
                                Payment Method:
                              </h4>
                              <p className="sherah-invoice-form__text">
                                Visa ending **** 4242
                              </p>
                              <p className="sherah-invoice-form__text">
                                sherahinfo@email.com
                              </p>
                            </div>
                            <div className="sherah-invoice-form__single sherah-invoice-form__single--right">
                              <h4 className="sherah-invoice-form__title">
                                Order Date:
                              </h4>
                              <p className="sherah-invoice-form__text">
                                November 02, 2022
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* End Sherah Invoice */}
                        <div className="row">
                          <div className="col-12">
                            <div className="sherah-table-order">
                              <table
                                id="sherah-table__orderv1"
                                className="sherah-table__main sherah-table__main--orderv1"
                              >
                                <thead className="sherah-table__head">
                                  <tr>
                                    <th className="sherah-table__column-1 sherah-table__h1">
                                      No
                                    </th>
                                    <th className="sherah-table__column-2 sherah-table__h2">
                                      Products name
                                    </th>
                                    <th className="sherah-table__column-3 sherah-table__h3">
                                      Price
                                    </th>
                                    <th className="sherah-table__column-4 sherah-table__h4">
                                      Quantity
                                    </th>
                                    <th className="sherah-table__column-4 sherah-table__h4">
                                      Total Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="sherah-table__body">
                                  <tr>
                                    <td className="sherah-table__column-4 sherah-table__data-1">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          01
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-2 sherah-table__data-2">
                                      <div className="sherah-table__product-name">
                                        <h4 className="sherah-table__product-name--title">
                                          Polka Dots Woman Dress
                                        </h4>
                                        <p className="sherah-table__product-name--text">
                                          Color : Black
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-3 sherah-table__data-3">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $612
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          2
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          {" "}
                                          $1,224
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="sherah-table__column-4 sherah-table__data-1">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          02
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-2 sherah-table__data-2">
                                      <div className="sherah-table__product-name">
                                        <h4 className="sherah-table__product-name--title">
                                          Sweater For Women
                                        </h4>
                                        <p className="sherah-table__product-name--text">
                                          Color : Light White
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-3 sherah-table__data-3">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $120
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          1
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $120
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="sherah-table__column-4 sherah-table__data-1">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          03
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-2 sherah-table__data-2">
                                      <div className="sherah-table__product-name">
                                        <h4 className="sherah-table__product-name--title">
                                          Convert for man shoe
                                        </h4>
                                        <p className="sherah-table__product-name--text">
                                          Color : Black &amp; Orange
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-3 sherah-table__data-3">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $450
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          3
                                        </p>
                                      </div>
                                    </td>
                                    <td className="sherah-table__column-4 sherah-table__data-4">
                                      <div className="sherah-table__product-content">
                                        <p className="sherah-table__product-desc">
                                          $1,350
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="order-totals">
                                <ul className="order-totals__list">
                                  <li className="order-totals__list--sub">
                                    <span>Subtotal</span>{" "}
                                    <span className="order-totals__amount">
                                      $790
                                    </span>
                                  </li>
                                  <li>
                                    <span>Store Credit</span>{" "}
                                    <span className="order-totals__amount">
                                      $-20
                                    </span>
                                  </li>
                                  <li>
                                    <span>Delivery Charges</span>{" "}
                                    <span className="order-totals__amount">
                                      $30
                                    </span>
                                  </li>
                                  <li>
                                    <span>Shipping</span>{" "}
                                    <span className="order-totals__amount">
                                      $25
                                    </span>
                                  </li>
                                  <li>
                                    <span>Vat Tax</span>{" "}
                                    <span className="order-totals__amount">
                                      $35
                                    </span>
                                  </li>
                                  <li className="order-totals__bottom">
                                    <span>Total</span>{" "}
                                    <span className="order-totals__amount">
                                      $35
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 mg-top-30">
                            <h4 className="mg-btm-10">Notes: </h4>
                            <p>
                              All accounts are to be paid within 7 days from
                              receipt of invoice. To be paid by cheque or credit
                              card or direct payment online. If account is not
                              paid within 7 days
                            </p>
                            <p>
                              the credits details supplied as confirmation of
                              work undertaken will be charged the agreed quoted
                              fee noted above.
                            </p>
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

export default Invoiceprint;
