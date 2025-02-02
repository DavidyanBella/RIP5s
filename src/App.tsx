import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import "./styles.css"
import HomePage from "pages/HomePage/HomePage.tsx";
import LoginPage from "pages/LoginPage/LoginPage.tsx";
import RegisterPage from "pages/RegisterPage/RegisterPage.tsx";
import CharactersListPage from "pages/CharactersListPage/CharactersListPage.tsx";
import CharacterPage from "pages/CharacterPage/CharacterPage.tsx";
import ArtworksPage from "pages/ArtworksPage/ArtworksPage.tsx";
import ArtworkPage from "pages/ArtworkPage/ArtworkPage.tsx";
import ProfilePage from "pages/ProfilePage/ProfilePage.tsx";
import Header from "components/Header/Header.tsx";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs.tsx";

function App() {
    return (
        <div>
            <Header />
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs />
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login/" element={<LoginPage />} />
                        <Route path="/register/" element={<RegisterPage />} />
                        <Route path="/characters/" element={<CharactersListPage />} />
                        <Route path="/characters/:id/" element={<CharacterPage />} />
                        <Route path="/artworks/" element={<ArtworksPage />} />
                        <Route path="/artworks/:id/" element={<ArtworkPage />} />
                        <Route path="/profile/" element={<ProfilePage />} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
