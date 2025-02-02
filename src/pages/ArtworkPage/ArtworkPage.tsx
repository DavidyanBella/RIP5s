import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteDraftArtwork,
    fetchArtwork,
    removeArtwork, sendDraftArtwork,
    triggerUpdateMM,
    updateArtwork
} from "store/slices/artworksSlice.ts";
import {Button, Col, Form, Row} from "reactstrap";
import {E_ArtworkStatus, T_Character} from "modules/types.ts";
import CharacterCard from "components/CharacterCard/CharacterCard.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";

const ArtworkPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated} = useAppSelector((state) => state.user)

    const artwork = useAppSelector((state) => state.artworks.artwork)

    const [name, setName] = useState<string>(artwork?.name)

    const [count, setCount] = useState<string>(artwork?.count)

    useEffect(() => {
        if (!is_authenticated) {
            navigate("/")
        }
    }, [is_authenticated]);

    useEffect(() => {
        is_authenticated && dispatch(fetchArtwork(id))
        return () => dispatch(removeArtwork())
    }, []);

    useEffect(() => {
        setName(artwork?.name)
        setCount(artwork?.count)
    }, [artwork]);

    const sendArtwork = async (e) => {
        e.preventDefault()

        await saveArtwork()

        await dispatch(sendDraftArtwork())

        navigate("/artworks/")
    }

    const saveArtwork = async (e?) => {
        e?.preventDefault()

        const data = {
            name
        }

        await dispatch(updateArtwork(data))
        await dispatch(triggerUpdateMM())
        await dispatch(triggerUpdateMM())
    }

    const deleteArtwork = async () => {
        await dispatch(deleteDraftArtwork())
        navigate("/characters/")
    }

    if (!artwork) {
        return (
            <div>

            </div>
        )
    }

    const isDraft = artwork.status == E_ArtworkStatus.Draft
    const isCompleted = artwork.status == E_ArtworkStatus.Completed

    return (
        <Form onSubmit={sendArtwork} className="pb-5">
            <h2 className="mb-5">{isDraft ? "Черновая история" : `Произведение №${id}` }</h2>
            <Row className="mb-5 fs-5 w-25">
                <CustomInput label="Название" placeholder="Введите название" value={name} setValue={setName} disabled={!isDraft}/>
                {isCompleted && <CustomInput label="Просмотров" value={count} disabled={true}/>}
            </Row>
            <Row>
                {artwork.characters.length > 0 ? artwork.characters.map((character:T_Character) => (
                    <Row key={character.id} className="d-flex justify-content-center mb-5">
                        <CharacterCard character={character} showRemoveBtn={isDraft} editMM={isDraft} />
                    </Row>
                )) :
                    <h3 className="text-center">Артефакты не добавлены</h3>
                }
            </Row>
            {isDraft &&
                <Row className="mt-5">
                    <Col className="d-flex gap-5 justify-content-center">
                        <Button color="success" className="fs-4" onClick={saveArtwork}>Сохранить</Button>
                        <Button color="primary" className="fs-4" type="submit">Отправить</Button>
                        <Button color="danger" className="fs-4" onClick={deleteArtwork}>Удалить</Button>
                    </Col>
                </Row>
            }
        </Form>
    );
};

export default ArtworkPage