import * as React from 'react';
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {T_Character} from "src/modules/types.ts";
import {Col, Container, Row} from "reactstrap";
import {CharacterMocks} from "src/modules/mocks.ts";
import mockImage from "assets/mock.png";

type Props = {
    selectedCharacter: T_Character | null,
    setSelectedCharacter: React.Dispatch<React.SetStateAction<T_Character | null>>,
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const CharacterPage = ({selectedCharacter, setSelectedCharacter, isMock, setIsMock}: Props) => {
    const { id } = useParams<{id: string}>();

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/characters/${id}`)
            const data = await response.json()
            setSelectedCharacter(data)
        } catch {
            createMock()
        }
    }

    const createMock = () => {
        setIsMock(true)
        setSelectedCharacter(CharacterMocks.find(character => character?.id == parseInt(id as string)) as T_Character)
    }

    useEffect(() => {
        if (!isMock) {
            fetchData()
        } else {
            createMock()
        }

        return () => setSelectedCharacter(null)
    }, []);

    if (!selectedCharacter) {
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
                        src={isMock ? mockImage as string : selectedCharacter.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedCharacter.name}</h1>
                    <p className="fs-5">Описание: {selectedCharacter.description}</p>
                    <p className="fs-5">Категория: {selectedCharacter.category}.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default CharacterPage