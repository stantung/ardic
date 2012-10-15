/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	config.language = 'en';
	// config.uiColor = '#AADC6E';
	config.toolbar = 'MyToolbar';
	
	// config.autoGrow_maxHeight = 800;
	// config.autoGrow_minHeight = 600;
	// config.width = '80%';
	
	config.height = '300px';
	
	config.filebrowserBrowseUrl      = '/kcfinder/browse.php?type=files';
	config.filebrowserImageBrowseUrl = '/kcfinder/browse.php?type=files';
	config.filebrowserFlashBrowseUrl = '/kcfinder/browse.php?type=files';
	config.filebrowserUploadUrl      = '/kcfinder/upload.php?type=files';
	config.filebrowserImageUploadUrl = '/kcfinder/upload.php?type=files';
	config.filebrowserFlashUploadUrl = '/kcfinder/upload.php?type=files';
    config.toolbar_MyToolbar =
    [
		[
			'Source', 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 
			'Link', 'Unlink', 'Anchor', 'Find', 'Replace', 'RemoveFormat'
		],
		['Styles','Format','Font','FontSize'],
	    ['TextColor','BGColor'],
		['Image', 'Flash']
    ];
};
