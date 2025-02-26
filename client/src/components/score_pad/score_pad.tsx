import ShareableHeader from './components/shareable_header/shareable_header';
import { PlayerFormList } from './components/player_form_list/player_form_list';

export const Scorepad = () => {
    return (
        <div className='container'>
            <div className='row'>
                <ShareableHeader />
                <PlayerFormList />
            </div>
        </div>
    );
};
