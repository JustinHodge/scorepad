export const ShareableHeader = () => {
    return (
        <h2>
            <em
                title='Click to copy shareable url'
                className='score-pad-heading'
                onPointerDown={() => {
                    const url = new URL(window.location.href);
                    navigator.clipboard.writeText(url.toString());
                    alert('Copied Url: ' + url.toString());
                }}
            >
                Click to Share this Pad!
            </em>
        </h2>
    );
};

export default ShareableHeader;
