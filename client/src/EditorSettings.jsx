
function EditorSettings(props) {
    const {
        options,
        setOptions,
        language,
        setLanguage,
        editorModes
    } = props;

    function languageChangeHandler(event) {
        const lang = event.target.value;
        setOptions({ ...options, mode: editorModes[lang] });
        return setLanguage(lang);
    }

    function onChangeHandler(event) {
        let { name, value } = event.target;
        return setOptions({ ...options, [name]: value });
    }

    return (
        <>
            <select
                name="mode"
                value={language}
                onChange={languageChangeHandler}
                className="editor-option px-2 py-1"
            >
                <option value="javascript">JavaScript</option>
                <option value="python3">Python3</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="ruby">Ruby</option>
                <option value="bash">Bash</option>
            </select>

            <select
                name="fontSize"
                onChange={onChangeHandler}
                value={options.fontSize}
                className="editor-option p-1"
            >
                <option value="14">14</option>
                <option value="16">16</option>
                <option value="18">18</option>
                <option value="20">20</option>
            </select>
        </>
    );
}

export default EditorSettings;
