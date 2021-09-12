import { Col, message, Row } from "antd";
import form from "antd/lib/form";
import { useForm } from "antd/lib/form/Form";
import { Gutter } from "antd/lib/grid/row";
import image from "antd/lib/image";
import { UploadFile } from "antd/lib/upload/interface";
import { ReactElement } from "react";
import { VehiclePhotosFormData } from "../../utils/formUtils/vehiclePhotosUtils";
import FormButtons from "../FormButtons";
import PhotoList from "./PhotoList";

interface VehiclePhotosProps {
    vehicleImages: VehiclePhotosFormData;
    setVehicleImages: React.Dispatch<React.SetStateAction<VehiclePhotosFormData>>
    onFinish: () => void;
    onBackStep: () => void;
}

const VehiclePhotos = ({
    vehicleImages,
    setVehicleImages,
    onFinish,
    onBackStep,
}: VehiclePhotosProps): ReactElement => {

    const onImageListChange = (imageSetName: keyof VehiclePhotosFormData , newImageList: UploadFile[]) => {
        //TODO: remove unused UploadFile items
        setVehicleImages({...vehicleImages, [imageSetName]: newImageList})
    }



    const getFormErrors = (): string[] => {
        const errors: string[] = [];
        //Todas los campos tienen al menos una imagen subida
        const allImagesSelected = vehicleImages.frontSide.length > 0 && 
            vehicleImages.backSide.length > 0 &&
            vehicleImages.leftSide.length > 0 &&
            vehicleImages.rightSide.length > 0;
        if (!allImagesSelected) {
            errors.push('Debe agregar imagenes de cada lado del vehículo');
        }

        //Todas las imagenes deben haberse cargado completamente
        let imagesNotUploaded = false;
        Object.values(vehicleImages).forEach((images) => {
            (images as UploadFile[]).forEach(image => {
                if (image.status != 'done') {
                    imagesNotUploaded = true;
                }
            })
        });

        return errors;
    }

    const  onSubmit = (direction: 'forward' | 'back' = 'forward') => { 
        const errors = getFormErrors();
        if (errors.length > 0) {
            message.error(errors[0])
            return;
        }
        direction === 'forward' ? onFinish() : onBackStep();
    }

    const gridGutter: [Gutter, Gutter] = [{ xs: 8, sm: 16, md: 24, lg: 32 }, 0]

    return (
        <>
        <Row gutter={gridGutter}>
            <Col xs={24} sm={24} md={12} lg={12}>
                <PhotoList 
                    uploadedImages={vehicleImages.frontSide} 
                    onImageListChange={(newImageList) => onImageListChange('frontSide', newImageList)}
                    uploadText={'Frente del vehiculo'}
                />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
                <PhotoList 
                    uploadedImages={vehicleImages.backSide} 
                    onImageListChange={(newImageList) => onImageListChange('backSide', newImageList)}
                    uploadText={'Parte trasera del vehiculo'}
                />
                
            </Col>
        </Row>
        <Row gutter={gridGutter}>
            <Col xs={24} sm={24} md={12} lg={12}>
                <PhotoList 
                    uploadedImages={vehicleImages.leftSide} 
                    onImageListChange={(newImageList) => onImageListChange('leftSide', newImageList)} 
                    uploadText={'Izquierda del vehiculo'}
                />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
                <PhotoList 
                    uploadedImages={vehicleImages.rightSide} 
                    onImageListChange={(newImageList) => onImageListChange('rightSide', newImageList)}
                    uploadText={'Derecha del vehiculo'}
                />
            </Col>
        </Row>
        <Row>
            <FormButtons onForwardButtonClick={() => onSubmit('forward')} onBackButtonClick={() => onSubmit('back')} />
        </Row>
        </>
    )
}

export default VehiclePhotos;