import {useState} from "react";
import Header from "components/Header";
import Breadcrumbs from "components/Breadcrumbs";
import CharacterPage from "pages/CharacterPage";
import CharactersListPage from "pages/CharactersListPage";
import {Route, Routes} from "react-router-dom";
import {T_Character} from "src/modules/types.ts";
import {Container, Row} from "reactstrap";
import HomePage from "pages/HomePage";
import "./styles.css"

function App() {

    const [characters, setCharacters] = useState<T_Character[]>([])

    const [selectedCharacter, setSelectedCharacter] = useState<T_Character | null>(null)

    const [isMock, setIsMock] = useState(false);

    const [characterName, setCharacterName] = useState<string>("")

    return (
        <div>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedCharacter={selectedCharacter} />
                </Row>
                <Row>
                    <Routes>
						<Route path="/" element={<HomePage />} />
                        <Route path="/characters/" element={<CharactersListPage characters={characters} setCharacters={setCharacters} isMock={isMock} setIsMock={setIsMock} characterName={characterName} setCharacterName={setCharacterName}/>} />
                        <Route path="/characters/:id" element={<CharacterPage selectedCharacter={selectedCharacter} setSelectedCharacter={setSelectedCharacter} isMock={isMock} setIsMock={setIsMock}/>} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
