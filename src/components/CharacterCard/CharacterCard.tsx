import {Button, Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {T_Character} from "modules/types.ts";
import {useEffect, useState} from "react";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import {addCharacterToArtwork, fetchCharacters} from "store/slices/charactersSlice.ts";
import {removeCharacterFromDraftArtwork, updateCharacterValue} from "store/slices/artworksSlice.ts";

type Props = {
    character: T_Character,
    showAddBtn?: boolean,
    showRemoveBtn?: boolean,
    editMM?: boolean,
}

const CharacterCard = ({character,  showAddBtn=false, showRemoveBtn=false, editMM=false}:Props) => {

    const dispatch = useAppDispatch()

    const {is_superuser} = useAppSelector((state) => state.user)

    const {save_mm} = useAppSelector(state => state.artworks)

    const [local_comment, setLocal_comment] = useState(character.comment)
    
    const location = useLocation()

    const isArtworkPage = location.pathname.includes("artworks")

    const handeAddToDraftArtwork = async () => {
        await dispatch(addCharacterToArtwork(character.id))
        await dispatch(fetchCharacters())
    }

    const handleRemoveFromDraftArtwork = async () => {
        await dispatch(removeCharacterFromDraftArtwork(character.id))
    }

    useEffect(() => {
        save_mm && updateValue()
    }, [save_mm]);

    const updateValue = async () => {
        dispatch(updateCharacterValue({
            character_id: character.id,
            comment: local_comment
        }))
    }

    if (isArtworkPage) {
        return (
            <Card key={character.id}>
                <Row>
                    <Col>
                        <img
                            alt=""
                            src={character.image}
                            style={{"width": "100%"}}
                        />
                    </Col>
                    <Col md={8}>
                        <CardBody>
                            <CardTitle tag="h5">
                                {character.name}
                            </CardTitle>
                            <CardText>
                                Категория: {character.category}
                            </CardText>
                            <CustomInput label="Комментарий" type="text" value={local_comment} setValue={setLocal_comment} disabled={!editMM || is_superuser} className={"w-25"}/>
                            <Col className="d-flex gap-5">
                                <Link to={`/characters/${character.id}`}>
                                    <Button color="primary" type="button">
                                        Открыть
                                    </Button>
                                </Link>
                                {showRemoveBtn &&
                                    <Button color="danger" onClick={handleRemoveFromDraftArtwork}>
                                        Удалить
                                    </Button>
                                }
                            </Col>
                        </CardBody>
                    </Col>
                </Row>
            </Card>
        );
    }

    return (
        <Card key={character.id} style={{width: '18rem' }}>
            <img
                alt=""
                src={character.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {character.name}
                </CardTitle>
                <CardText>
                    Категория: {character.category}
                </CardText>
                <Col className="d-flex justify-content-between">
                    <Link to={`/characters/${character.id}`}>
                        <Button color="primary" type="button">
                            Открыть
                        </Button>
                    </Link>
                    {showAddBtn &&
                        <Button color="secondary" onClick={handeAddToDraftArtwork}>
                            Добавить
                        </Button>
                    }
                </Col>
            </CardBody>
        </Card>
    );
};

export default CharacterCard