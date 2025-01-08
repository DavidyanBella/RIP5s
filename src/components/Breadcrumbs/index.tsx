import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {T_Character} from "modules/types.ts";

interface Props {
    selectedCharacter: T_Character | null
}

const Breadcrumbs = ({ selectedCharacter }: Props) => {

    const location = useLocation()

    return (
        <Breadcrumb className="fs-5">
			{location.pathname == "/" &&
				<BreadcrumbItem>
					<Link to="/">
						Главная
					</Link>
				</BreadcrumbItem>
			}
			{location.pathname.includes("/characters") &&
                <BreadcrumbItem active>
                    <Link to="/characters">
						Артефакты
                    </Link>
                </BreadcrumbItem>
			}
            {selectedCharacter &&
                <BreadcrumbItem active>
                    <Link to={location.pathname}>
                        { selectedCharacter.name }
                    </Link>
                </BreadcrumbItem>
            }
			<BreadcrumbItem />
        </Breadcrumb>
    );
};

export default Breadcrumbs