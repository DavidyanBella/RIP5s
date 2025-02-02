import {Link} from "react-router-dom";
import {Badge, Button} from "reactstrap";

type Props = {
    isActive: boolean,
    draft_artwork_id: string,
    characters_count: number
}

const Bin = ({isActive, draft_artwork_id, characters_count}:Props) => {

    if (!isActive) {
        return <Button color={"secondary"} className="bin-wrapper" disabled>Корзина</Button>
    }

    return (
        <Link to={`/artworks/${draft_artwork_id}/`} className="bin-wrapper">
            <Button color={"primary"} className="w-100 bin">
                Корзина
                <Badge>
                    {characters_count}
                </Badge>
            </Button>
        </Link>
    )
}

export default Bin