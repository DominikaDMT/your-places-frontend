import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

// reducer function - przyjmuje dwa argumenty - aktualny stan i akcje

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true,
      };
    }
    // zwracany nowy stan - np. obiekt, ale nie koniecznie
    default:
      return state;
    // default zwraca niezmienioną akcję
  }
};

const Input = (props) => {
  // przy wywołainu trzeba podać conajmniej jeden argument (reducer - funkcja, która otrzymuje akcję, którą można dispatch, i widzi aktualny stan, a gdy zostanie on zaktualizowany na bazie akcji, którą otrzyma, zwroci nowy stan, a useReducer przekaże go w komponencie i zrenderuje wszystko? )
  // drugi (opcjonalny) argument, to initial state
  // useReducer zwraca dwa elementy: current state i dispatch, który pozwoli przekazać akcje do reducera
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (e) => {
    // przekazujemy obiekt akcji
    dispatch({
      type: 'CHANGE',
      val: e.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
    });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        // onBlur - kiedy uzytkownik straci fokus z elementu
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${!inputState.isValid && inputState.isTouched 
        && 'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
