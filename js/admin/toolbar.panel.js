/**
 * @base_url from header.php
 */
jQuery(document).ready(function(){
	
	/**
	 * Action for AddNew.
	 */
	jQuery("#btnAddNew").click(function(){
		var Local = location.href.replace("#", '');
		location.href = base_url + '/' + jQuery('input[name="controller"]').val() + '/' + jQuery('input[name="controller_mathod"]').val();
		return false;
	});

	/**
	 * Action for SaveData.
	 */
	jQuery("#btnSave").click(function(){
		jQuery("#frmMain").submit();
	});
	
	/**
	 * Action for Submit.
	 */	
	jQuery("#btnSubmit").click(function(){
		jQuery("#frmMain").submit();
	});
	
	/**
	 * Action for Cancel.
	 */
	jQuery("#btnCancel").click(function(){
		location.href = base_url+"/"+jQuery('input[name="controller"]').val();
	});
	
	/**
	 * Action for Remove All.
	 */
	jQuery("#btnRemoveAll").click(function(){
		if (confirm('Delete All ?')) {
			var ids = [];
			jQuery(':checkbox').each(function(index, value){
				if (jQuery(this).val() != 0)
					ids.push(jQuery(this).val());
			});
			jQuery('input[name="action"]').attr('value', 'remove');
			jQuery('input[name="id"]').val(ids);
			jQuery("#frmMain").submit();
		}
	});
	
	/**
	 * Action for Remove.
	 */
	jQuery(".btnRemove").each(function(index, value){
		jQuery(this).click(function(){
			var Local = location.href.replace("#", '');
			if (confirm('您確定要移除這筆資料 ?')) {
				// jQuery("#frmMain").attr('action', jQuery("#controller").val() + "/remove");
				// document.frmMain.action = jQuery("#controller").val() + "/remove";
				jQuery('input[name="action"]').attr('value', 'remove');
				jQuery('input[name="id"]').val(jQuery(this).attr('ndx'));
				jQuery("#frmMain").submit();
				return false;
			}
		});
	});
	
	/**
	 * Action for Update.
	 */
	jQuery(".btnEdit").each(function(index, value){
		jQuery(this).click(function(){			
			jQuery('input[name="action"]').attr('value', 'update');
			jQuery('input[name="id"]').val(jQuery(this).attr('ndx'));
			
			// jQuery("#action").attr('value', 'update');
			// jQuery("#id").val(jQuery(this).attr('ndx'));
			jQuery("#frmMain").submit();
			return false;
		});
	});
	
	/**
	 * Action for Checked All Item.
	 */
	jQuery("#checkAll").click(function(){
		if (jQuery(this).attr('checked')) {
			jQuery(':checkbox').each(function(index, value){
				if (jQuery(this).attr('id') != "chkAll") {
					jQuery(this).attr('checked', true);
				}
			});				
		} else {
			jQuery(':checkbox').each(function(index, value){					
				if (jQuery(this).attr('id') != "chkAll") {
					jQuery(this).attr('checked', false);
				}
			});
		}
	});
	
	/**
	 * Action for SaveOrder
	 */
	jQuery("#btnSaveOrder").click(function(){
		var ids = [];
		jQuery(':checkbox').each(function(index, value){
			if (jQuery(this).val() != 0)
				ids.push(jQuery(this).val());
		});
		jQuery('input[name="action"]').attr('value', 'order');
		jQuery('input[name="id"]').val(ids);
		jQuery("#frmMain").submit();
	});
	
	jQuery(".btmPublish").each(function(index, value){
		jQuery(this).click(function(){
			jQuery('input[name="action"]').attr('value', 'publish');
			jQuery('input[name="id"]').val(jQuery(this).attr('ndx'));
			jQuery("#frmMain").submit();
			return false;
		});		
	});
	
	/**
	 * Action for Export
	 */
	jQuery("#btnExport").click(function(){
		jQuery('input[name="action"]').attr('value', 'export');
		jQuery("#frmMain").submit();
		return false;		
	});
	
	
});