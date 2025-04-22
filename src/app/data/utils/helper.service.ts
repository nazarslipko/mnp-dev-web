import { Injectable } from '@angular/core';
import {
  IDayReminder,
  IHourlyReminder,
  IQuestionType,
  IRecurrenceValues,
  ITime,
} from '../../core/models/IHelpers';
//import{saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  iTime?: ITime[];
  questionType: IQuestionType[] = [];
  recurrence?: IRecurrenceValues[];
  dayReminder?: IDayReminder[];
  hourlyReminder?: IHourlyReminder[];

  constructor() {}

  getQuestionTypes(): IQuestionType[] {
    return (this.questionType = [
      { QuestionTypeId: 'TrueFalse', QuestionType: 'Yes/No' },
      { QuestionTypeId: 'SingleChoice', QuestionType: 'Single Choice' },
      { QuestionTypeId: 'MultipleChoices', QuestionType: 'Multiple Choices' },
      { QuestionTypeId: 'Dropdownlist', QuestionType: 'Dropdownlist' },
      { QuestionTypeId: 'ShortAnswer', QuestionType: 'Short Answer' },
      { QuestionTypeId: 'LongAnswer', QuestionType: 'Long Answer' },
    ]);
  }
  getTime(): ITime[] {
    this.iTime = [
      { TimeId: '12:00AM', Time: '12:00 AM' },
      { TimeId: '12:30AM', Time: '12:30 AM' },
      { TimeId: '1:00AM', Time: '1:00 AM' },
      { TimeId: '1:30AM', Time: '1:30 AM' },
      { TimeId: '2:00AM', Time: '2:00 AM' },
      { TimeId: '2:30AM', Time: '2:30 AM' },
      { TimeId: '3:00AM', Time: '3:00 AM' },
      { TimeId: '3:30AM', Time: '3:30 AM' },
      { TimeId: '4:00AM', Time: '4:00 AM' },
      { TimeId: '4:30AM', Time: '4:30 AM' },
      { TimeId: '5:00AM', Time: '5:00 AM' },
      { TimeId: '5:30AM', Time: '5:30 AM' },
      { TimeId: '6:00AM', Time: '6:00 AM' },
      { TimeId: '6:30AM', Time: '6:30 AM' },
      { TimeId: '7:00AM', Time: '7:00 AM' },
      { TimeId: '7:30AM', Time: '7:30 AM' },
      { TimeId: '8:00AM', Time: '8:00 AM' },
      { TimeId: '8:30AM', Time: '8:30 AM' },
      { TimeId: '9:00AM', Time: '9:00 AM' },
      { TimeId: '9:30AM', Time: '9:30 AM' },
      { TimeId: '10:00AM', Time: '10:00 AM' },
      { TimeId: '10:30AM', Time: '10:30 AM' },
      { TimeId: '11:00AM', Time: '11:00 AM' },
      { TimeId: '11:30AM', Time: '11:30 AM' },
      { TimeId: '12:00PM', Time: '12:00 PM' },
      { TimeId: '12:30PM', Time: '12:30 PM' },
      { TimeId: '1:00PM', Time: '1:00 PM' },
      { TimeId: '1:30PM', Time: '1:30 PM' },
      { TimeId: '2:00PM', Time: '2:00 PM' },
      { TimeId: '2:30PM', Time: '2:30 PM' },
      { TimeId: '3:00PM', Time: '3:00 PM' },
      { TimeId: '3:30PM', Time: '3:30 PM' },
      { TimeId: '4:00PM', Time: '4:00 PM' },
      { TimeId: '4:30PM', Time: '4:30 PM' },
      { TimeId: '5:00PM', Time: '5:00 PM' },
      { TimeId: '5:30PM', Time: '5:30 PM' },
      { TimeId: '6:00PM', Time: '6:00 PM' },
      { TimeId: '6:30PM', Time: '6:30 PM' },
      { TimeId: '7:00PM', Time: '7:00 PM' },
      { TimeId: '7:30PM', Time: '7:30 PM' },
      { TimeId: '8:00PM', Time: '8:00 PM' },
      { TimeId: '8:0PM', Time: '8:30 PM' },
      { TimeId: '9:00PM', Time: '9:00 PM' },
      { TimeId: '9:30PM', Time: '9:30 PM' },
      { TimeId: '10:00PM', Time: '10:00 PM' },
      { TimeId: '10:30PM', Time: '10:30 PM' },
      { TimeId: '11:00PM', Time: '11:00 PM' },
      { TimeId: '11:30PM', Time: '11:30 PM' },
    ];
    return this.iTime;
  }

  // hourly reminders
  getHourlyReminder(): IHourlyReminder[] {
    this.hourlyReminder = [
      { HourId: '3', Hour: '3 Hours' },
      { HourId: '6', Hour: '6 Hours' },
      { HourId: '9', Hour: '9 Hours' },
      { HourId: '12', Hour: '12 Hours' },
    ];
    return this.hourlyReminder;
  }

  // day reminders
  getDayReminder(): IDayReminder[] {
    this.dayReminder = [
      { DayId: '1', Day: 'One Day' },
      { DayId: '2', Day: 'Two Days' },
      { DayId: '3', Day: 'Three Days' },
      { DayId: '4', Day: 'Four Days' },
      { DayId: '5', Day: 'Five Days' },
      { DayId: '6', Day: 'Six Days' },
      { DayId: '7', Day: 'One Week' },
      { DayId: '14', Day: 'Two Weeks' },
      { DayId: '30', Day: 'One Month' },
    ];
    return this.dayReminder;
  }

  // day reminders
  getReccurence(): IRecurrenceValues[] {
    this.recurrence = [
      /* { "RecurrenceId": 'NoFixeTime', "Recurrence": "No Fixed Time" }, */
      { RecurrenceId: 'Daily', Recurrence: 'Daily' },
      { RecurrenceId: 'Weekly', Recurrence: 'Weekly' },
      { RecurrenceId: 'Monthly', Recurrence: 'Monthly' },
      { RecurrenceId: 'Yearly', Recurrence: 'Yearly' },
    ];
    return this.recurrence;
  }

  validateForm(controlName: string, error: any): string {
    let invalid = '';

    if (error.required) {
      invalid = controlName + ' is required';
    } else if (error.minlength) {
      invalid = controlName + ' is too short';
    } else if (error.maxlength) {
      invalid = controlName + ' is too long';
    } else if (!error.valid) {
      invalid = controlName + ' is invalid';
    }
    return invalid;
  }

  downloadCSV(objects: any[], fileName = 'data.csv') {
    if (!objects || objects.length === 0) {
      console.error('No data available to download');
      return;
    }

    // Extract headers dynamically
    const headers = Object.keys(objects[0]).join(',');

    // Map data rows with proper escaping
    const csvRows = objects.map((obj) =>
      Object.values(obj)
        .map((value) => {
          if (value === null || value === undefined) {
            return ''; // Handle null/undefined
          }
          // Escape double quotes and wrap values in quotes
          const escapedValue = String(value).replace(/"/g, '""');
          return `"${escapedValue}"`;
        })
        .join(',')
    );

    // Combine header and rows into CSV content
    const csvContent = [headers, ...csvRows].join('\n');

    // Trigger download
    this.triggerFileDownload(csvContent, fileName, 'text/csv;charset=utf-8;');
  }

  // Download JSON
  downloadJSON(objects: any[], fileName = 'data.json', prettyPrint = true) {
    if (!objects || objects.length === 0) {
      console.error('No data available to download');
      return;
    }

    let jsonContent: string;
    try {
      jsonContent = prettyPrint
        ? JSON.stringify(objects, null, 2)
        : JSON.stringify(objects);
    } catch (error) {
      console.error('Error serializing JSON:', error);
      return;
    }

    this.triggerFileDownload(
      jsonContent,
      fileName,
      'application/json;charset=utf-8;'
    );
  }

  triggerFileDownload(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
}
