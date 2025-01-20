import Header from "components/Header/Header.tsx";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs.tsx";
import CharacterPage from "pages/CharacterPage/CharacterPage.tsx";
import CharactersListPage from "pages/CharactersListPage/CharactersListPage.tsx";
import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import HomePage from "pages/HomePage/HomePage.tsx";
import {useState} from "react";
import {T_Character} from "modules/types.ts";

function App() {

    const [characters, setCharacters] = useState<T_Character[]>([])

    const [selectedCharacter, setSelectedCharacter] = useState<T_Character | null>(null)

    const [isMock, setIsMock] = useState(false);

    return (
        <>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedCharacter={selectedCharacter}/>
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/characters/" element={<CharactersListPage characters={characters} setCharacters={setCharacters} isMock={isMock} setIsMock={setIsMock} />} />
                        <Route path="/characters/:id" element={<CharacterPage selectedCharacter={selectedCharacter} setSelectedCharacter={setSelectedCharacter} isMock={isMock} setIsMock={setIsMock} />} />
                    </Routes>
                </Row>
            </Container>
        </>
    )
}

export default App
