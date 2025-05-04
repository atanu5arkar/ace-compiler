import { useRef, useState } from "react";

function Output({ data }) {
    if (data == "")
        return <p>Output:</p>

    if (data == "Server Error")
        return <p className="text-red-400">Something Went Wrong!</p>

    const leftFlexItem = useRef(null);
    const [colBasis, setColBasis] = useState(0.5);

    const {
        pid,
        code,
        signal,
        msg,
        time,
        memory,
        stdout,
        stderr
    } = data.output;

    function flexColResizeHandler(ev) {
        const availableSpace = innerWidth - (innerWidth * 0.2);
        const newWidth = ev.clientX - (innerWidth * 0.2);
        const fraction = newWidth / availableSpace;
        const resizeCondition = fraction >= 0.45 && fraction <= 0.6;

        if (resizeCondition) return setColBasis(fraction);
    }

    function startColResize() {
        document.body.style.cursor = "col-resize";
        document.addEventListener("mousemove", flexColResizeHandler);
        document.addEventListener("mouseup", endColResize);
    }

    function endColResize() {
        document.body.style.cursor = "";
        document.removeEventListener("mousemove", flexColResizeHandler);
        document.removeEventListener("mouseup", endColResize);
    }

    return (
        <>
            <div
                ref={leftFlexItem}
                className="text-xs 2xl:text-sm space-y-1.5 pr-6 shrink-0"
                style={{
                    flexBasis: `calc(100% * ${colBasis})`
                }}
            >
                <p>PID: <span className="text-yellow-200">{pid}</span></p>

                <p>
                    Code: <span className={code == 0 ? "text-yellow-200" : "text-red-500"}> {code ?? "NULL"} </span>
                </p>

                <p>
                    Signal: <span className={signal ? "text-red-500" : undefined}> {signal ?? "NULL"} </span>
                </p>

                <div>
                    Memory:&nbsp;
                    {
                        Object.keys(memory).map((ele, i) => {
                            return (
                                <span key={i} className="text-indigo-400">
                                    {ele} <span className="text-yellow-200"> {memory[ele]} </span>
                                </span>
                            )
                        })
                    }
                </div>

                <div>
                    Time:&nbsp;
                    {
                        time
                            ? Object.keys(time).map((ele, i) => {
                                return (
                                    <span key={i} className="text-indigo-400">
                                        {ele} <span className="text-yellow-200"> {time[ele]} </span>
                                    </span>
                                )
                            })
                            : <span className="text-red-500">NULL</span>
                    }
                </div>

                <p>
                    Message: <span className={code == 0 ? "text-yellow-200" : "text-red-500"}>{msg}</span>
                </p>
            </div>

            {/* Column resize handle */}

            <div className="self-center cursor-col-resize" onMouseDown={startColResize}>
                <i className="fa-solid fa-grip-lines-vertical"></i>
            </div>

            <div className="text-xs 2xl:text-sm pl-6 overflow-y-auto grow break-words space-y-2">
                <div>
                    stdout:<br />
                    <p className="whitespace-pre text-yellow-200">{stdout}</p>
                </div>

                <div className="">
                    stderr: {
                        code ? <p className="text-red-500 whitespace-pre-wrap">{stderr}</p> : "NULL"
                    }
                </div>
            </div>
        </>
    );
}

export default Output;
