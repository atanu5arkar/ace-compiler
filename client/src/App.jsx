import { useState, useEffect } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/keybinding-vscode";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-sh";

import './App.css';
import FilePicker from "./FilePicker.jsx";
import EditorSettings from "./EditorSettings.jsx";
import Output from './Output.jsx';
import spinner from "./assets/spinner.gif";

function Ribbon(props) {
    const [filename, setFilename] = useState("No file.");
    const [blob, setBlob] = useState(null);

    const {
        options,
        setOptions,
        language,
        setLanguage,
        code,
        setCode,
        loading,
        setLoading,
        args,
        saveURL,
        setOutput } = props;

    const editorModes = {
        javascript: "javascript",
        python3: "python",
        c: "c_cpp",
        cpp: "c_cpp",
        java: "java",
        ruby: "ruby",
        bash: "sh",
    };
    const extensions = {
        javascript: "js",
        python3: "py",
        c: "c",
        cpp: "cpp",
        java: "java",
        ruby: "rb",
        bash: "sh",
    };

    async function runReqHandler() {
        try {
            if (code[language] == '') return;
            setLoading(true);

            const req = new Request(`/api/compiler/${extensions[language]}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language, source_code: code[language], cmd_args: args })
            });

            let res = await fetch(req);
            if (!res.ok) throw new Error("Server Error");

            res = await res.json();
            setLoading(false);
            return setOutput(res);

        } catch (error) {
            console.error(error);
            setLoading(false);
            return setOutput(error.message);
        }
    }

    return (
        <div className="flex justify-between items-center px-2 text-sm font-[Fredoka] bg-gray-300">
            <FilePicker
                blob={blob}
                setBlob={setBlob}
                options={options}
                setOptions={setOptions}
                filename={filename}
                setFilename={setFilename}
                code={code}
                setCode={setCode}
                setLanguage={setLanguage}
                editorModes={editorModes}
                extensions={extensions}
            />

            <div className="flex items-center gap-x-1">
                <button
                    type="button"
                    onClick={runReqHandler}
                    disabled={loading}
                    className={`${loading ? "cursor-not-allowed" : "cursor-pointer"} bg-green-600 hover:bg-green-700 rounded text-white px-4 py-1`}
                >
                    <i className="fa-solid fa-play fa-xs"></i>
                </button>

                <a
                    href={saveURL}
                    download={`source_code.${extensions[language]}`}
                    className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 rounded text-white px-4 py-1"
                >
                    <i className="fa-solid fa-download fa-xs"></i>
                </a>

                <button
                    type="button"
                    onClick={() => {
                        setCode({ ...code, [language]: "" });
                        setOutput('');
                        setBlob(null);
                        setFilename('No file.');
                    }}
                    className="cursor-pointer bg-red-500 hover:bg-red-600 rounded text-white px-4 py-1"
                >
                    <i className="fa-solid fa-trash fa-xs"></i>
                </button>

                <EditorSettings
                    options={options}
                    setOptions={setOptions}
                    language={language}
                    setLanguage={setLanguage}
                    editorModes={editorModes}
                />
            </div>
        </div>
    );
}

function App() {
    const [code, setCode] = useState({
        javascript: "// Node.js is locked and loaded.\n",
        python3: "# Woah! The snake charmer is here.\n",
        c: "/* Let's C the world. */\n",
        cpp: "/* Heyy Genius! I'm proud of you. */\n",
        ruby: "# Ruby is the most precious of 'em, isn't it?\n",
        bash: "# That damn penguin is everywhere, doug!\n",
        java: "// The following class is mandatory\n\npublic class MyJava {\n\t// Your java stuff goes here\n}\n"
    });
    const [args, setArgs] = useState('');
    const [language, setLanguage] = useState("javascript");
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [saveURL, setSaveURL] = useState(URL.createObjectURL(new Blob([''])));
    const [options, setOptions] = useState({
        mode: "javascript",
        fontSize: 14,
    });
    const [rows, setRows] = useState([0.55, 0.45]);

    useEffect(() => {
        let data = localStorage.getItem("userdata");
        if (!data) return;
        const { code: sourceCodes, args, language, options } = JSON.parse(data);

        Object.keys(sourceCodes).forEach(lang => {
            const str = sourceCodes[lang];
            if (str) setCode(code => ({ ...code, [lang]: str }));
        });
        setArgs(args);
        setLanguage(language);
        setOptions(options);
    }, []);

    function gridRowResizeHandler(ev) {
        const availableSpace = innerHeight - 40;
        const newHeight = ev.clientY - 35;
        const fraction = newHeight / availableSpace
        const resizeCondition = newHeight >= 150 && newHeight <= (availableSpace - 250);

        if (resizeCondition) return setRows([fraction, 1 - fraction]);
    }

    function startRowResize() {
        document.body.style.cursor = "row-resize";
        document.addEventListener("mousemove", gridRowResizeHandler);
        document.addEventListener("mouseup", endRowResize);
    }

    function endRowResize() {
        document.body.style.cursor = "";
        document.removeEventListener("mousemove", gridRowResizeHandler);
        document.removeEventListener("mouseup", endRowResize);
    }

    function codeChangeHandler(value) {
        URL.revokeObjectURL(saveURL);

        const blob = new Blob([value]);
        const url = URL.createObjectURL(blob);

        localStorage.setItem("userdata", JSON.stringify({
            code: { ...code, [language]: value }, args, language, options
        }));
        setCode({ ...code, [language]: value });
        return setSaveURL(url);
    }

    function argsChangeHandler(event) {
        const { value } = event.target;
        setArgs(value);
        return localStorage.setItem("userdata", JSON.stringify({
            code: { ...code, [language]: value },
            args: value, language, options
        }));
    }

    return (
        <>
            {/* UI for screen widths less than 768px */}

            <div className="md:hidden h-screen flex flex-col gap-y-6 items-center justify-center px-4 bg-gray-200">
                <p><i className="fa-solid fa-terminal fa-3x text-gray-500 animate-bounce"></i></p>
                <p className="text-center text-xl text-gray-700 font-medium">
                    You need a bigger screen, mate.<br />
                    ACE is available on Desktops and Tablets only.
                </p>
            </div>

            {/* The actual UI */}

            <main className="hidden md:grid grid-cols-[20%_1fr] *:h-screen max-w-screen-2xl max-h-screen mx-auto">
                {/* An intro to the app */}

                <section className="p-4 lg:py-6 flex flex-col justify-between font-[Fredoka] bg-gray-100">
                    <div>
                        <p className="text-sm animate-bounce">Your <span className="text-indigo-600"> coding BFF</span></p>
                        <h2 className="text-xl 2xl:text-2xl text-gray-700 font-sans font-bold mb-1 2xl:mb-3">
                            <span className="">Ace</span> Compiler
                        </h2>
                    </div>

                    <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-sans font-bold 2xl:leading-14">
                        <span className="text-indigo-600">Code.</span>
                        <br />
                        Edit.
                        <br />
                        <span className="text-green-600">Execute.</span>
                    </h1>

                    {/* A short copy to introduce the app */}
                    <div className="text-sm 2xl:text-base space-y-4">
                        <p>
                            No <span className="text-red-500"> setup </span> needed.

                            Just Ace the World.
                        </p>
                        <ul className="pl-4 list-disc">
                            <li>VS Code like Editor.</li>
                            <li>Supports 7 Languages.</li>
                            <li>Upload your own file.</li>
                            <li>Download your code anytime.</li>
                        </ul>
                    </div>

                    {/* Links to the author's socials */}
                    <div className="space-y-3">
                        <p className="text-xs 2xl:text-sm text-gray-500">&#169; 2025 Atanu Sarkar</p>

                        <div className="flex justify-between">
                            <a href="mailto:atanu_sarkar1@outlook.com">
                                <i className="fa-regular fa-envelope fa-lg"></i>
                            </a>
                            <a href="https://github.com/atanu5arkar" target="_blank">
                                <i className="fa-brands fa-github fa-lg"></i>
                            </a>
                            <a href="https://www.instagram.com/atanu.dev/" target="_blank">
                                <i className="fa-brands fa-instagram fa-lg"></i>
                            </a>
                            <a href="https://x.com/x_atanu" target="_blank">
                                <i className="fa-brands fa-x-twitter fa-lg"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/atanu23/" target="_blank">
                                <i className="fa-brands fa-linkedin fa-lg"></i>
                            </a>
                        </div>
                    </div>
                </section>

                {/* The compiler */}
                <section
                    className="grid"
                    style={{
                        gridTemplateRows: `35px calc((100vh - 45px) * ${rows[0]}) 10px calc((100vh - 45px) * ${rows[1]})`
                    }}
                >
                    <Ribbon
                        options={options}
                        setOptions={setOptions}
                        language={language}
                        setLanguage={setLanguage}
                        code={code}
                        setCode={setCode}
                        loading={loading}
                        setLoading={setLoading}
                        setOutput={setOutput}
                        saveURL={saveURL}
                        args={args}
                    />

                    {/* The editor */}

                    <div>
                        <AceEditor
                            name="ace-atanu"
                            placeholder={""}
                            mode={options.mode}
                            theme="github_dark"
                            fontSize={+options.fontSize}
                            value={code[language]}
                            lineHeight={18}
                            showPrintMargin={false}
                            keyboardHandler="vscode"
                            debounceChangePeriod={1000}
                            onChange={codeChangeHandler}
                            wrapEnabled={true}
                            setOptions={{
                                enableLiveAutocompletion: true,
                                newLineMode: "unix"
                            }}
                            style={{
                                width: "100%",
                                height: "100%",
                                fontFamily: "Fira Code",
                            }}
                        />
                    </div>

                    {/* Row resize handle */}

                    <div
                        className="cursor-row-resize flex justify-center items-center gap-x-0.5"
                        onMouseDown={startRowResize}
                    >
                        <div className="w-1/12 h-1/4 rounded-xl bg-gray-500"></div>
                    </div>

                    {/* I/O */}

                    <div className="*:text-sm *:font-[Fira_Code] flex flex-col">

                        <div className="h-[50px] flex gap-x-4 items-center px-4 bg-gray-300/70">
                            <label htmlFor="args" className="font-medium">Input:</label>
                            <input
                                type="text"
                                id="args"
                                value={args}
                                placeholder="command line arguments"
                                onChange={argsChangeHandler}
                                className="grow focus:outline-none rounded px-4 py-2 bg-gray-50"
                            />
                        </div>

                        <div className={`h-[calc(100%-50px)] flex ${loading ? "justify-center items-center" : "justify-between"} bg-zinc-800 text-green-400 p-4 text-sm`}>
                            {
                                loading
                                    ? <figure className="">
                                        <img src={spinner} alt="loading spinner" className="w-20" />
                                    </figure>
                                    : <Output data={output} />
                            }
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default App;
