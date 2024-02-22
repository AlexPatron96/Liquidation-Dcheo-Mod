import React from 'react';

const Itemformshow = ({ title, show, name, handle, ico, btnaction, balance }) => {
    return (
        <div className="form-group" style={{ display: "flex", justifyContent: "space-between" }}>
            <label className="col-form-label col-form-label-sm" htmlFor="monedas">{title}: </label>
            <div className="btn-group" role="group" aria-label="Basic example">
                {/* <div style={{ display: "flex", flexDirection: "row" }}> */}

                {
                    ico ? (
                        <button className="btn btn-success" onClick={() => btnaction()}>
                            <i className={`fa-solid ${ico ? ico : "fa-dollar-sign"} bx-sm`}></i>
                        </button>
                    ) : (
                        <span className="btn btn-success disabled">
                            <i className={`fa-solid ${ico ? ico : "fa-dollar-sign"} bx-sm`}></i>
                        </span>
                    )
                }
                <input name={name}
                    onChange={(e) => handle(e)}
                    aria-label="Amount (to the nearest dollar)"
                    className="form-control form-control-sm text-md-center"
                    style={{
                        maxWidth: "90px",
                        borderRadius: "0",
                        border: `1px solid 
                    ${balance === 0 ?
                                "var(--color2)" : balance > 0 ?
                                    "var(--color7)" : balance < 0 ?
                                        "var(--color3)" : "var(--color2)"}`
                    }}
                    value={show ? (show) : ''} />
            </div >
        </div >
    );
};

export default Itemformshow;