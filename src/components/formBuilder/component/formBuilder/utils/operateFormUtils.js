// TODO need refactor
export const calcFormComponentLayout = (formDataArray) => {
    formDataArray.forEach((item) => {
        let domElement = document.getElementById(item.key);

        let newHeight = Math.floor((domElement.offsetHeight) / 30);

        item.layout.h = newHeight;
        item.layout.y = y;
        y += newHeight;
    })
}