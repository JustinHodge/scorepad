import { useContext, useState, useEffect } from 'react';
import {
    IPlayer,
    IRequestUpdatePlayerData,
    IRequestUpdateScoreData,
} from '../../../../../../../../types';
import ScorepadContext from '../../../../../../contexts/score_pad';
import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CloseButton,
    Col,
    Form,
    Image,
    Row,
} from 'react-bootstrap';

interface IProps {
    player: IPlayer;
}

const INPUT_REQUEST_DELAY_MS = 1000;

const SCORE_UPDATE_BUTTONS = [
    {
        label: '+1',
        value: 1,
    },
    {
        label: '+10',
        value: 10,
    },
    {
        label: '-1',
        value: -1,
    },
    {
        label: '-10',
        value: -10,
    },
];

export const PlayerCard = ({ player }: IProps) => {
    const {
        requestUpdatePlayerData,
        requestUpdatePlayerScore,
        requestRemovePlayer,
    } = useContext(ScorepadContext);

    const [updatePlayerData, setUpdatePlayerData] =
        useState<IRequestUpdatePlayerData | null>(null);
    const [updatePlayerScore, setUpdatePlayerScore] =
        useState<IRequestUpdateScoreData | null>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (updatePlayerData !== null && updatePlayerData !== undefined) {
                requestUpdatePlayerData(updatePlayerData);
                setUpdatePlayerData(null);
            }

            if (updatePlayerScore !== null && updatePlayerScore !== undefined) {
                requestUpdatePlayerScore(updatePlayerScore);
                setUpdatePlayerScore(null);
            }
        }, INPUT_REQUEST_DELAY_MS);

        return () => clearTimeout(timeoutId);
    });

    if (!player || !player.id) {
        return null;
    }

    return (
        <Card key={player.id} className='my-2'>
            <Card.Header className='d-flex justify-content-between'>
                <Row>
                    <Col>
                        <Form.Control
                            type='text'
                            className='border-0 bg-transparent'
                            value={player.name}
                            onChange={(e) => {
                                requestUpdatePlayerData({
                                    playerId: player.id ?? '',
                                    newName: e.target.value,
                                });
                            }}
                        ></Form.Control>
                    </Col>
                    <Col xs={2}>
                        <CloseButton
                            // TODO: add warning before player deletion
                            variant='danger'
                            onClick={() => {
                                requestRemovePlayer(player.id ?? '');
                            }}
                        />
                    </Col>
                </Row>
            </Card.Header>
            <CardBody>
                <Row className='py-1'>
                    <Col>
                        <Form.Control
                            type='text'
                            className='border-0 bg-transparent'
                            value={player.score ?? ''}
                            onChange={(e) => {
                                requestUpdatePlayerScore({
                                    playerId: player.id ?? '',
                                    newScore: Number.parseInt(e.target.value),
                                });
                            }}
                        ></Form.Control>
                    </Col>
                    <Col xs={3}>
                        <Button variant='secondary'>
                            <Image
                                className='button-icon'
                                src='/tool_box.svg'
                            />
                        </Button>
                    </Col>
                </Row>
                <Row className='py-1'>
                    <ButtonGroup>
                        {SCORE_UPDATE_BUTTONS.map((button) => {
                            return (
                                <Button
                                    variant='secondary'
                                    key={button.label}
                                    onClick={() => {
                                        const newScore =
                                            (player.score ?? 0) + button.value;

                                        requestUpdatePlayerScore({
                                            playerId: player.id ?? '',
                                            newScore: newScore,
                                        });
                                    }}
                                >
                                    {button.label}
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                </Row>
            </CardBody>
        </Card>
    );
};

export default PlayerCard;
