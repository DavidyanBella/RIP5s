import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchCharacters, updateCharacterName} from "store/slices/charactersSlice.ts";
import CharacterCard from "components/CharacterCard/CharacterCard.tsx";
import Bin from "components/Bin/Bin.tsx";

const CharactersListPage = () => {

    const dispatch = useAppDispatch()

    const {characters, character_name} = useAppSelector((state) => state.characters)

    const {is_authenticated} = useAppSelector((state) => state.user)

    const {draft_artwork_id, characters_count} = useAppSelector((state) => state.artworks)

    const hasDraft = draft_artwork_id != null

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateCharacterName(e.target.value))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(fetchCharacters())
    }

    useEffect(() => {
        dispatch(fetchCharacters())
    }, [])

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs="8">
                                <Input value={character_name} onChange={handleChange} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                {is_authenticated &&
                    <Col className="d-flex flex-row justify-content-end" md="6">
                        <Bin isActive={hasDraft} draft_artwork_id={draft_artwork_id} characters_count={characters_count} />
                    </Col>
                }
            </Row>
            <Row className="mt-5 d-flex">
                {characters?.map(character => (
                    <Col key={character.id} className="mb-5 d-flex justify-content-center" sm="12" md="6" lg="4">
                        <CharacterCard character={character} showAddBtn={is_authenticated} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CharactersListPage