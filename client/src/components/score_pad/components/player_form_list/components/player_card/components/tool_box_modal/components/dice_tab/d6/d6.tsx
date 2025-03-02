import './d6.css';

export const D6 = () => {
    return (
        <div className='d-flex justify-content-center align-items-center h-100'>
            <div className='d6'>
                <div className='d6-face face-1'>1</div>
                <div className='d6-face face-2'>2</div>
                <div className='d6-face face-3'>3</div>
                <div className='d6-face face-4'>4</div>
                <div className='d6-face face-5'>5</div>
                <div className='d6-face face-6'>6</div>
            </div>
        </div>
    );
};

export default D6;
