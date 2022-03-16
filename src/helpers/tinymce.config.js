import { URL } from './constants';

export default {
    // content_css : '/css/editor.css',
    content_css: '/admin/css/editor.css',
    fontsize_formats: '1em 0.25em 0.5em 0.75em 1em 1.25em 1.5em',
    height: 250,
    resize: 'none',
    plugins: [
        'advlist autolink lists link image imagetools charmap print preview anchor code',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
    ],
    toolbar: 'undo redo | forecolor | fontsizeselect | bold italic underline strikethrough | \
    alignleft aligncenter alignright alignjustify | link | \
    bullist numlist outdent indent | insertfile image media | removeformat code',
    imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
    images_upload_url: `${URL}/api/images`,
}
