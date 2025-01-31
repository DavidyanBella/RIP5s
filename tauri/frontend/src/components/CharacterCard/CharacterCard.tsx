import {Button, Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import mockImage from "assets/mock.png";
import {Link} from "react-router-dom";
import {T_Character} from "modules/types.ts";

interface CharacterCardProps {
    character: T_Character,
    isMock: boolean
}

const CharacterCard = ({character, isMock}: CharacterCardProps) => {
    return (
        <Card key={character.id} style={{width: '18rem', margin: "0 auto 50px" }}>
            <CardImg
                src={isMock ? mockImage as string : character.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {character.name}
                </CardTitle>
                <CardText>
                    Категория: {character.category}.
                </CardText>
                <Link to={`/characters/${character.id}`}>
                    <Button color="primary">
                        Открыть
                    </Button>
                </Link>
            </CardBody>
        </Card>
    );
};

export default CharacterCard