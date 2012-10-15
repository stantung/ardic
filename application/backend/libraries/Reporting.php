<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Reporting
{
	
	private $CI;
	
	function __construct()
	{
		$this->CI =& get_instance();
	}
	
	public function export_inquiry($setDescription = '', $stmt = '', $ndx)
	{
		$objPHPExcel = new PHPExcel();
				
		$objPHPExcel->getProperties()
					->setCreator("Beef Daddy")
					->setLastModifiedBy("Synyao Inquiry Cart")
					->setTitle("Office 2007 XLSX Document")
					->setSubject("Office 2007 XLSX Document")
					->setDescription($setDescription)
					->setKeywords("office 2007 openxml php")
					->setCategory("");
					
		$objPHPExcel->getActiveSheet()->setTitle('Customer Info');		
				
		$InquiryDetails = $objPHPExcel->createSheet();
		$InquiryDetails->setTitle('Inquiry');
		
		$Query = $this->CI->db->query("SELECT * FROM inquiry WHERE id = ?", $ndx)->result();
		
		$objPHPExcel->setActiveSheetIndex(0)->mergeCells('A1:D1')->setCellValue('A1', "Customer Information");
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('E1', "Inquiry Date : ");
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('F1', date("Y/m/d H:i:s"));
		
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('A3', "Name : ");
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('A4', "Company : ");
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('A5', "Country : ");
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('A6', "Address : ");
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('A7', "Business Type : ");
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('A8', "Main Market : ");
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('A9', "do u know Synyao ?");
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('A10', "Message : ");
		
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('B3', $Query[0]->name);
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('B4', $Query[0]->company);
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('B5', $Query[0]->country);
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('B6', $Query[0]->address);
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('B7', $Query[0]->business);
		
		// 列舉 Location.
		$Query_Location = $this->CI->db->query("SELECT * FROM inquiry_market WHERE qid = ?", $Query[0]->id)->result();
		$str_location = "";
		foreach ($Query_Location as $item_loc) {
			$str_location .= $item_loc->location . " ,";
		}
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('B8', (empty($str_location)) ? "" : substr($str_location, 0, strlen($str_location) - 1));
		
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('B9', $Query[0]->how_do_you_know);
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('B10',$Query[0]->message);
		
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('E3', "Tel : ");
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('E4', "Fax : ");
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('E5', "E-mail : ");
		
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('F3', $Query[0]->phone);
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('F4', $Query[0]->fax);
		$objPHPExcel->setActiveSheetIndex(0)->setCellValue('F5', $Query[0]->email);
		
		
		// $objPHPExcel->setActiveSheetIndex(1)->setCellValue('A1', "Inquiry#: ");
		// $objPHPExcel->setActiveSheetIndex(1)->setCellValue('J1', "Inquiry Date : ");
		// $objPHPExcel->setActiveSheetIndex(1)->setCellValue('K1', date("Y/m/d H:i:s"));
		
		$objPHPExcel->setActiveSheetIndex(1)->setCellValue('A1', "No");
		$objPHPExcel->setActiveSheetIndex(1)->setCellValue('B1', "品號 / Item");
		$objPHPExcel->setActiveSheetIndex(1)->setCellValue('C1', "品名 / Product Name / Specifications");
		$objPHPExcel->setActiveSheetIndex(1)->setCellValue('D1', "尺寸 / Size");
		$objPHPExcel->setActiveSheetIndex(1)->setCellValue('E1', "顏色 / Color");
		$objPHPExcel->setActiveSheetIndex(1)->setCellValue('F1', "最低訂購量 / MOQ");
		$objPHPExcel->setActiveSheetIndex(1)->setCellValue('G1', "詢價數量 / QTY");
		$objPHPExcel->setActiveSheetIndex(1)->setCellValue('H1', "詢價單位 / Unit");
		$objPHPExcel->setActiveSheetIndex(1)->setCellValue('I1', "報價(USD) / Quotation(USD)");
		$objPHPExcel->setActiveSheetIndex(1)->setCellValue('J1', "小計 / Amount");
		$objPHPExcel->setActiveSheetIndex(1)->setCellValue('K1', "備註 / Remark");
		
		$Product = $this->CI->db->query("SELECT * FROM inquiry_item WHERE qid = ?", $ndx)->result();
		$i = 1;
		$j = 2;
		foreach ($Product as $item) {
			// print_r($item);
			$objPHPExcel->setActiveSheetIndex(1)->setCellValue('A'.$j , $i);
			$objPHPExcel->setActiveSheetIndex(1)->setCellValue('B'.$j , $item->sku);
			$objPHPExcel->setActiveSheetIndex(1)->setCellValue('C'.$j , $item->name);
			$objPHPExcel->setActiveSheetIndex(1)->setCellValue('D'.$j , $item->size);
			$objPHPExcel->setActiveSheetIndex(1)->setCellValue('E'.$j , $item->color);
			$objPHPExcel->setActiveSheetIndex(1)->setCellValue('F'.$j , 300);
			$objPHPExcel->setActiveSheetIndex(1)->setCellValue('G'.$j , $item->qty);
			$objPHPExcel->setActiveSheetIndex(1)->setCellValue('H'.$j , "SET");
			$objPHPExcel->setActiveSheetIndex(1)->setCellValue('I'.$j , "");
			$objPHPExcel->setActiveSheetIndex(1)->setCellValue('J'.$j , "");
			$objPHPExcel->setActiveSheetIndex(1)->setCellValue('K'.$j , "");
			
			$i++; 
			$j++;
		}
		
		$objPHPExcel->setActiveSheetIndex(1)->mergeCells('A'.$j.':E'.$j)->setCellValue('A'.$j, "Total");
		
		$title = "Report : Inquiry " . date("Y-m-d H:i:s");
		$objWriter = IOFactory::createWriter($objPHPExcel, 'Excel5');
		// $objWriter = IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save("excel/" . $title . ".xls");
		
		$this->CI->zip->read_file("excel/".$title.".xls");
		// $this->CI->zip->download('inquiry.zip');
		
		return "excel/".$title.".xls";
				
	}
	
}