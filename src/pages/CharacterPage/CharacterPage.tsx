import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchCharacter, removeSelectedCharacter} from "store/slices/charactersSlice.ts";

const CharacterPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {character} = useAppSelector((state) => state.characters)

    useEffect(() => {
        dispatch(fetchCharacter(id))
        return () => dispatch(removeSelectedCharacter())
    }, []);

    if (!character) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md="6">
                    <img
                        alt=""
                        src={character.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{character.name}</h1>
                    <p className="fs-5">Описание: {character.description}</p>
                    <p className="fs-5">Категория: {character.category}</p>
                </Col>
            </Row>
        </Container>
    );
};

export default CharacterPage