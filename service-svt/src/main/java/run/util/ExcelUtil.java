package run.util;

import org.apache.poi.hssf.usermodel.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * excel导出工具类
 */
public class ExcelUtil {
    /**
     * Excel表格导出
     * @param response HttpServletResponse对象
     * @param excelData Excel表格的数据，封装为List<List<String>>
     * @param sheetName sheet的名字
     * @param fileName 导出Excel的文件名
     * @param columnWidth Excel表格的宽度，建议为15
     * @throws IOException 抛IO异常
     */
    public static void exportExcel(HttpServletResponse response,
                                   List<Map<String,Object>> excelData,
                                   String sheetName,
                                   String fileName,
                                   int columnWidth) throws IOException {

        //声明一个工作簿
        HSSFWorkbook workbook = new HSSFWorkbook();

        //生成一个表格，设置表格名称
        HSSFSheet sheet = workbook.createSheet(sheetName);

        //设置表格列宽度
        sheet.setDefaultColumnWidth(columnWidth);

        //写入List<>中的数据
        int rowNum = 1;

        String[] headers = { "行政区域", "机构名称", "站点名称", "RTU-ID","串口号","监测仪ID","型号","名称","安装位置","顺线倾斜角(°)","横向倾斜角(°)","顺线倾斜度","横向倾斜度","综合倾斜度","记录时间"};
        //headers表示excel表中第一行的表头
        HSSFRow row = sheet.createRow(0);
        //在excel表中添加表头
        for (int i = 0; i < headers.length; i++) {
            HSSFCell cell = row.createCell(i);
            HSSFRichTextString text = new HSSFRichTextString(headers[i]);
            cell.setCellValue(text);
        }

        //在表中存放查询到的数据放入对应的列
        for (Map<String,Object> map : excelData) {
            HSSFRow row1 = sheet.createRow(rowNum);
            row1.createCell(0).setCellValue(map.get("site_province")+" "+map.get("site_city")+" "+map.get("site_county"));
            row1.createCell(1).setCellValue(map.get("structureName")+"");
            row1.createCell(2).setCellValue(map.get("site_name")+"");
            row1.createCell(3).setCellValue(map.get("rtu_id")+"");
            row1.createCell(4).setCellValue(map.get("rtu_channel")+"");
            row1.createCell(5).setCellValue(map.get("tilt_id")+"");
            row1.createCell(6).setCellValue(map.get("tilt_model")+"");
            row1.createCell(7).setCellValue(map.get("tilt_name")+"");
            row1.createCell(8).setCellValue(map.get("tilt_location")+"");
            row1.createCell(9).setCellValue(map.get("tilt_value1")+"");
            row1.createCell(10).setCellValue(map.get("tilt_value2")+"");
            row1.createCell(11).setCellValue(map.get("tilt_gx")+"");
            row1.createCell(12).setCellValue(map.get("tilt_gy")+"");
            row1.createCell(13).setCellValue(map.get("tilt_gs")+"");
            row1.createCell(14).setCellValue(map.get("write_time")+"");
            rowNum++;
        }

        //准备将Excel的输出流通过response输出到页面下载
        System.out.println(workbook.getSheet("test"));
        System.out.println(sheet.getHeader());
        //八进制输出流
        System.out.println("八进制输出流");
        response.setContentType("application/octet-stream");

        //设置导出Excel的名称
        System.out.println("设置导出Excel的名称");
        response.setHeader("Content-disposition", "attachment;filename=" + new String(fileName.getBytes(), "ISO8859-1") +".xls");

        //刷新缓冲
        System.out.println("刷新缓冲");
        response.flushBuffer();

        //workbook将Excel写入到response的输出流中，供页面下载该Excel文件
        System.out.println("workbook将Excel写入到response的输出流");
        workbook.write(response.getOutputStream());

        //关闭workbook
        workbook.close();
    }
}
