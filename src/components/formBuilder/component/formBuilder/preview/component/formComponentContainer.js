import FormComponent from './formComponent';
import EmptyFormComponent from './formItemDoms/component/formComponentEmpty';
import SingleText from "./formItemDoms/component/singleText";
import NumberInput from "./formItemDoms/component/numberInput";
import RadioButtons from "./formItemDoms/component/radioButtons";
import EmailInput from './formItemDoms/component/emailInput';
import PhoneInput from './formItemDoms/component/phoneInput';

import FileUpload from "./formItemDoms/component/fileUpload";
import CheckboxInput from "./formItemDoms/component/checkboxInput";
import IdCardInput from "./formItemDoms/component/idCardInput";
import DropDown from "./formItemDoms/component/dropdown";
import DateInput from "./formItemDoms/component/dateInput";
import FormChild from "./formItemDoms/component/formChild";
import TextArea from "./formItemDoms/component/textArea";
import MultiDropDown from "./formItemDoms/component/multiDropDown";
import DragParent from "./formItemDoms/component/dragParent";
import HandWrittenSignature from "./formItemDoms/component/handWrittenSignature";

import ImageUpload from './formItemDoms/component/imageUpload';
import GetLocalPosition from './formItemDoms/component/getLocalPositon';
import FormChildTest from './formItemDoms/component/formChildTest';
import Address from "./formItemDoms/component/Address";
import ComponentTemplate from "./formItemDoms/component/componentTemplate";
import SubmitButton from "./formItemDoms/component/button";

const FormElements = {};

FormElements.Button = FormComponent(SubmitButton);
FormElements.SingleText = FormComponent(SingleText);
FormElements.NumberInput = FormComponent(NumberInput);
FormElements.RadioButtons = FormComponent(RadioButtons);
FormElements.EmptyFormComponent = FormComponent(EmptyFormComponent);
FormElements.EmailInput = FormComponent(EmailInput);
FormElements.PhoneInput = FormComponent(PhoneInput);

FormElements.CheckboxInput = FormComponent(CheckboxInput);
FormElements.IdCardInput = FormComponent(IdCardInput);
FormElements.DropDown = FormComponent(DropDown);
FormElements.DateInput = FormComponent(DateInput);
FormElements.FileUpload = FormComponent(FileUpload);

FormElements.FormChild = FormComponent(FormChild);
FormElements.FormChildTest = FormComponent(FormChildTest);
FormElements.TextArea = FormComponent(TextArea);
FormElements.MultiDropDown = FormComponent(MultiDropDown);
FormElements.DragParent = FormComponent(DragParent);
FormElements.HandWrittenSignature = FormComponent(HandWrittenSignature);

FormElements.ImageUpload = FormComponent(ImageUpload);
FormElements.GetLocalPosition = FormComponent(GetLocalPosition);
FormElements.FormChildTest = FormComponent(FormChildTest);
FormElements.Address = FormComponent(Address);
FormElements.ComponentTemplate = FormComponent(ComponentTemplate);

export default FormElements;
