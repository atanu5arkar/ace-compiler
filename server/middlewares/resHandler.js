function resHandler(req, res) {
    try {
        return res.status(200).json({ output: { ...req.processInfo } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server Error." });
    }
}

export default resHandler;