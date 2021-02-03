import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  // useRef - może też przechowywać value, które przetrwa rerending cycles
  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    // gdy fileReader załaduje nowy plik - poniższa funkcja się wywoła, gdy readAsDataURL się zakończy
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    // poniższe nie zwraca Promisa ani nie działa z callbackami
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (e) => {
    let pickedFile;
    let fileIsValid = isValid;
    // property files - files that user selected - default js
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      // powyższe nie zaktualizuje sie od razu, stąd druga zmienna
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    // tutaj isValid nie byłoby aktualne
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
    // używamy inputa bez widzenia go
  };

  return (
    <div className='form-control'>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type='file'
        accept='.jpg,.png,.jpeg'
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className='image-upload__preview'>
          {previewUrl && <img src={previewUrl} alt='Preview' />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type='button' onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
