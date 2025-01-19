import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import CharacterCard from "components/CharacterCard/CharacterCard.tsx";
import {ChangeEvent, FormEvent, useEffect} from "react";
import * as React from "react";
import {RootState, useAppSelector} from "src/store/store.ts";
import {updateCharacterName} from "src/store/slices/charactersSlice.ts";
import {T_Character} from "modules/types.ts";
import {CharacterMocks} from "modules/mocks.ts";
import {useDispatch} from "react-redux";
import "./styles.css"

type Props = {
    characters: T_Character[],
    setCharacters: React.Dispatch<React.SetStateAction<T_Character[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const CharactersListPage = ({characters, setCharacters, isMock, setIsMock}:Props) => {

    const dispatch = useDispatch()

    const {character_name} = useAppSelector((state:RootState) => state.characters)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateCharacterName(e.target.value))
    }

    const createMocks = () => {
        setIsMock(true)
        setCharacters(CharacterMocks.filter(character => character.name.toLowerCase().includes(character_name.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        await fetchCharacters()
    }

    const fetchCharacters = async () => {
        try {
            const env = await import.meta.env;
            const response = await fetch(`${env.VITE_API_URL}/api/characters/?character_name=${character_name.toLowerCase()}`)
            const data = await response.json()
            setCharacters(data.characters)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    useEffect(() => {
        fetchCharacters()
    }, []);

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
            </Row>
            <Row>
                {characters?.map(character => (
                    <Col key={character.id} sm="12" md="6" lg="4">
                        <CharacterCard character={character} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CharactersListPage