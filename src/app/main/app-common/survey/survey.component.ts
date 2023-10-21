import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { locale as spanish } from './i18n/es';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import * as Survey from 'survey-angular';
import * as widgets from 'surveyjs-widgets';
import * as SurveyPDF from 'survey-pdf';

widgets.icheck(Survey);
widgets.select2(Survey);
widgets.inputmask(Survey);
widgets.jquerybarrating(Survey);
widgets.jqueryuidatepicker(Survey);
widgets.nouislider(Survey);
widgets.select2tagbox(Survey);
//widgets.signaturepad(Survey);
widgets.sortablejs(Survey);
// widgets.ckeditor(Survey);
widgets.autocomplete(Survey);
widgets.bootstrapslider(Survey);
widgets.prettycheckbox(Survey);
//widgets.emotionsratings(Survey);
//initCustomWidget(Survey);

Survey.JsonObject.metaData.addProperty('questionbase', 'popupdescription:text');
Survey.JsonObject.metaData.addProperty('page', 'popupdescription:text');

var defaultThemeColors = Survey.StylesManager.ThemeColors['default'];
defaultThemeColors['$main-color'] = '#2f376d';
defaultThemeColors['$main-hover-color'] = '#2f376d';
defaultThemeColors['$text-color'] = '#4a4a4a';
defaultThemeColors['$header-color'] = '#2f376d';

defaultThemeColors['$header-background-color'] = '#4a4a4a';
defaultThemeColors['$body-container-background-color'] = 'transparent';

Survey.StylesManager.applyTheme();

@Component({
    selector: 'survey-control',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit {
    @Output() submitSurvey = new EventEmitter<any>();
    @Input() json: object;
    @Input() surveyComponentId: string;
    @Input() submitBtnText: string = '';
    @Input() dataJson: string;
    @Input() mode: string;
    @Input() setReadOnlyAfterComplete: string = 'N';
    @Input() renderSurveyComponent: string = 'Y';
    @Input() fileName: string = '';
    @Input() title: string; 
    @Input() subTitle: string;
    @Input() process: string;
    @Input() code: string;
    @Input() version: string;
    @Input() logo: any;
    @Input() note: any;
    @Input() resolution: any;
    @Input() surveyHeight = '200px'; 
    @Input() spinnerDiameter = '45'; 
    result: any;
    renderingSurvey = true;

    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private translate: TranslateService
    ) {
        this._fuseTranslationLoaderService.loadTranslations(spanish);
    }

    ngOnInit() {
        if(this.renderSurveyComponent === 'N'){
            this.renderingSurvey = false;
        }
        
        Survey.ChoicesRestfull.onBeforeSendRequest = function (
            sender,
            options
        ) {
            var authToken = localStorage.getItem('token');
            options.request.setRequestHeader(
                'Authorization',
                'Bearer ' + authToken
            );
        };

        if (this.json !== null && this.json !== undefined) {
            setTimeout(() => {
                this.initSurvey();
            }, 500);
        }
    }

    public loadSurvey(json, dataJson = null) {
        this.json = json;
        this.dataJson = dataJson;
        this.initSurvey();
    }

    initSurvey() {
        const surveyModel = new Survey.Model(this.json);

        surveyModel.onAfterRenderSurvey.add((survey, options) => {
            //Toca agregar estos elementos html para que el panel de las preguntas no se recorte
            if (this.mode !== undefined && this.mode !== null && this.mode === 'display') {
                var span = document.createElement("span");
                span.innerHTML = " ";
                span.setAttribute('data-bind', 'css: cssNavigationComplete');
                span.className = "sv_complete_btn";

                var div = document.createElement("div");
                div.setAttribute('data-bind', 'css: css.footer');
                div.className = "sv_nav";
                div.appendChild(span);

                var body = options.htmlElement[1].querySelectorAll(".sv_body")[0];
                body.appendChild(div);
            }

            this.renderingSurvey = false;
        });

        surveyModel.onComplete.add((result, options) => {
            var questionsNames = result.questionHashes.names;
            var surveyResult = [];
            for (var key in questionsNames) {
                var tokenValue = '';

                if (result.data.hasOwnProperty(key)) {
                    tokenValue = result.data[key];
                }

                surveyResult.push({ Name: key, Value: tokenValue });
            }
            this.submitSurvey.emit(surveyResult);
            this.result = result.data;
            this.dataJson = this.result;
            surveyModel.data = this.dataJson;

            if (this.setReadOnlyAfterComplete.toUpperCase() === 'Y') {
                this.mode = 'display';
                surveyModel.mode = this.mode;
            }

            surveyModel.clear();
            surveyModel.render();

            for (var key in this.result) {
                if (this.result.hasOwnProperty(key)) {
                    let question = surveyModel.getQuestionByName(key);
                    if (question !== undefined && question !== null) {
                        question.value = this.result[key];
                    }
                }
            }
        });

        surveyModel.onAfterRenderQuestion.add((sender, options) => {
            var question = options.question;
            if (
                question.getType() === 'dropdown' &&
                question['renderAs'] === 'select2'
            ) {
                question.value = 'other';
            }
        });

        surveyModel.onAfterRenderQuestionInput.add((sender, options) => {

            const question = options.question;
            //Aplica solo para preguntas multilinea
            if (question.getType() !== "comment" && question.getType() !== "matrixdropdown") return;

            const maxLength = question.getMaxLength();

            var element = options.htmlElement;

            if(maxLength !== null)
            {
                var counterDiv = document.createElement('div');
                var charLength = 0;
            
                counterDiv.style.textAlign =  'right';
                counterDiv.textContent = `${charLength} / ${maxLength}`;
                element.parentNode.insertBefore(counterDiv, element.nextSibling); // Note: If you want the counter upside the textarea, remove the ".nextSibling"
                var countCharacters = function() {
                    // Remove multiple spaces & trim the value, in order to make its character counter clear from trash (this also prevent user to insert fake characters)
                    charLength = this.value.length;
                    counterDiv.textContent = `${charLength} / ${maxLength}`;
                }
            
                element.addEventListener('input', countCharacters);

                // (optional) Also, don't forget fire the count function for saved answers (old data, like cache)
                var event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                element.dispatchEvent(event);
            }
            else{
                element.style.cssText += 'border: none !important';
            }
        });

        if (this.submitBtnText) {
            surveyModel.completeText = this.submitBtnText;
        } else {
            this.translate.get('SURVEY.SUBMIT').subscribe((res: string) => {
                surveyModel.completeText = res;
            });
        }

        if (this.dataJson !== undefined && this.dataJson !== null && this.dataJson !== '') {
            surveyModel.data = this.dataJson;
        }

        if (this.mode !== undefined && this.mode !== null && this.mode !== '') {
            surveyModel.mode = this.mode;
        }

        if(this.renderSurveyComponent == 'Y')
        {
            Survey.SurveyNG.render(this.surveyComponentId, { model: surveyModel });
        }
    }

    setRendering(value){
        this.renderingSurvey = value;
    }

    async saveSurveyToPdf(saveType = 'saveAsFile'): Promise<string> {
        let dataurl = '';
        
        const options = {
            fontSize: 10,
            haveCommercialLicense: true,
            margins: {
                left: 20,
                right: 20,
                top: 40,
                bot: 20
            },
            format: [210, 297],
            pagebreak: { mode: 'avoid-all' }
        };

        const surveyPDF = new SurveyPDF.SurveyPDF(this.json, options);
        surveyPDF.haveCommercialLicense = true;
        surveyPDF.isSinglePage= true;
        

        if (this.dataJson !== undefined && this.dataJson !== null && this.dataJson !== '') {
            surveyPDF.data = this.dataJson;
        }

        surveyPDF.mode = 'display';
        surveyPDF.onRenderHeader.add((_, canvas) => {
            
            const horizontalAlignLeft = "left" as SurveyPDF.HorizontalAlign;
            const horizontalAlignCenter = "center" as SurveyPDF.HorizontalAlign;
            const verticalAlignTop = "top" as SurveyPDF.VerticalAlign;
            const verticalAlignBottom = "Bottom" as SurveyPDF.VerticalAlign;
            const line = '-------------------------------------------------------------------------------------------------------------------------------------------';
            const line2 = '|'  + '\n' +  '|' +  '\n' +  '|'  +  '\n' +  '|'  +  '\n' ;
            canvas.drawText({ text: this.note + '\n' + this.resolution, 
                fontSize: 7,  
                verticalAlign: verticalAlignTop,
                margins: {
                    top: 20,
                    left: 40,
                    right: 30
                }});    
            canvas.drawImage({
                base64: this.logo,
                horizontalAlign: horizontalAlignLeft,
                width: 150,
                height: 50,
                margins: {
                    left: 80,
                    top: 50
                }
            });
            canvas.drawText({ text: line2 + line2 + line2 + line2, 
                fontSize: 2, 
                isBold: true,
                horizontalAlign: horizontalAlignLeft,
                margins: {
                    left: (canvas.rect.yBot - canvas.rect.yTop) *  2.3,
                }});

            canvas.drawText({ text: this.title, 
                fontSize: 12, 
                isBold: true,
                horizontalAlign: horizontalAlignLeft,
                margins: {
                    left: (canvas.rect.yBot - canvas.rect.yTop) *  2.5,
                }});
            canvas.drawText({ text: this.subTitle, 
                fontSize: 8, 
                isBold: true,
                horizontalAlign: horizontalAlignLeft,
                margins: {
                    left: (canvas.rect.yBot - canvas.rect.yTop) *  2.5,
                    top: 70
                } });
            canvas.drawText({ text: line, fontSize: 5, isBold: true,
            horizontalAlign: horizontalAlignLeft,
            margins: {
                left: (canvas.rect.yBot - canvas.rect.yTop) *  2.3,
                top: 85
            } });
            canvas.drawText({ text: this.process + '\n' + this.code + '\n' + this.version, 
            fontSize: 7, 
            isBold: true,
            horizontalAlign: horizontalAlignLeft,
            margins: {
                left: (canvas.rect.yBot - canvas.rect.yTop) * 2.5,
                top: 100,
                bot: 50
            } });
        });
        surveyPDF.onRenderFooter.add((_, canvas) => {
            canvas.drawText({
                text: canvas.pageNumber + '/' + canvas.countPages, fontSize: 10,
                margins: {
                    right: 12
                }
            });
        });
        
        if (saveType === "saveAsFile") {
            const NewFileName = this.fileName.replace(/[^a-zA-Z0-9 ]/g, '');
            await surveyPDF.save(NewFileName);
        } else {
            dataurl = await surveyPDF.raw("dataurlstring");
        }

        return dataurl;
    }
}
