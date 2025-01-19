import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {T_Character} from "src/modules/types.ts";
import CharacterCard from "components/CharacterCard";
import {CharacterMocks} from "src/modules/mocks.ts";
import {FormEvent, useEffect} from "react";
import * as React from "react";

type Props = {
    characters: T_Character[],
    setCharacters: React.Dispatch<React.SetStateAction<T_Character[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
    characterName: string,
    setCharacterName: React.Dispatch<React.SetStateAction<string>>
}

const CharactersListPage = ({characters, setCharacters, isMock, setIsMock, characterName, setCharacterName}:Props) => {

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/characters/?character_name=${characterName.toLowerCase()}`)
            const data = await response.json()
            setCharacters(data.characters)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    const createMocks = () => {
        setIsMock(true)
        setCharacters(CharacterMocks.filter(character => character.name.toLowerCase().includes(characterName.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        if (isMock) {
            createMocks()
        } else {
            await fetchData()
        }
    }


    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md="8">
                                <Input value={characterName} onChange={(e) => setCharacterName(e.target.value)} placeholder="Поиск..."></Input>
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
                    <Col key={character.id} xs="4">
                        <CharacterCard character={character} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CharactersListPage