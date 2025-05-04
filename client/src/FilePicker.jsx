import { useState } from "react";

function FilePicker(props) {
    const [fileType, setFileType] = useState(null);
    const {
        blob,
        setBlob,
        filename,
        setFilename,
        options,
        setOptions,
        code,
        setCode,
        setLanguage,
        editorModes,
        extensions } = props;

    function onChangeHandler(event) {
        const file = event.target.files[0];
        if (!file) return;

        setBlob(null);
        setFileType(null);
        setFilename(file.name.length <= 15 ? file.name : file.name.slice(0, 15) + "...");

        const extension = file.name.split('.').pop();
        if (!Object.values(extensions).includes(extension)) return;

        setBlob(file);
        return setFileType(extension);
    }

    function onClickHandler() {
        if (!blob || !fileType)
            return setFilename("Please pick a valid file.");

        for (var key in extensions) {
            if (extensions[key] == fileType) {
                setOptions({ ...options, mode: editorModes[key] });
                setLanguage(key);
                break;
            }
        }
        const reader = new FileReader();

        reader.onerror = () => {
            console.error("Unable to read the file. Try again.");
            return reader.onerror = null;
        };
        reader.onload = () => {
            setCode({ ...code, [key]: reader.result });
            return reader.onload = null;
        };
        return reader.readAsText(blob);
    }

    return (
        <div>

            <label htmlFor="fileUpload" className="cursor-pointer text-white bg-gray-600 hover:bg-gray-700 px-4 py-1.5 rounded mr-1">Choose File</label>
            <input
                id="fileUpload"
                type="file"
                name="fileUpload"
                accept=".js,.c,.cpp,.java,.py,.sh,.rb"
                onChange={onChangeHandler}
                className="hidden"

            />
            <button
                type="button" onClick={onClickHandler}
                className="cursor-pointer text-white bg-gray-600 hover:bg-gray-700 px-4 py-1 rounded mr-2">
                <i className="fa-solid fa-upload fa-xs"></i>
            </button>
            <span className={blob ? "text-gray-600" : "text-red-600"}>{filename}</span>
        </div>
    );
}

export default FilePicker;
