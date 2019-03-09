function getOptionVersion() {

    var optionVer = 1;
    return optionVer;

}

function getOptionListDefault() {

    var obj = {
        EXT_Version: '0.0.0',
        OPT_Version: 0,
        GLB_Enabled: true,
        GLB_AutoRedirectToLogin: true,
        GLB_BackToTopButton: true,
        GLB_KeepSessionAlive: true,
        GLB_HighResImage: true,
        GLB_RaspberryFavicon: true,
        GLB_RaspberryWelcomePage: true,
        GLB_HighlightColor: '#ff2b5a'
    };

    return obj;

}

function getHighlightColorList() {
    var list = [{
        name: 'Raspberry',
        color: '#ff2b5a'
    }, {
        name: 'Orange',
        color: '#f59300'
    }, {
        name: 'Green',
        color: '#7eb620'
    }, {
        name: 'Turquoise',
        color: '#09abb4'
    }, {
        name: 'Blue',
        color: '#0088fb'
    }, {
        name: 'Purple',
        color: '#9571d1'
    }, {
        name: 'Pink',
        color: '#ff7cd6'
    }, {
        name: 'Neutral',
        color: '#757575'
    }];
    return list;
}

function getCommonAssetList(type) {
    if (type.toLowerCase() === 'css')
        return {
            'font': {method: 'user'},
            'footer': {method: 'user'},
            'form': {method: 'dom'},
            'heading': {method: 'user'},
            'navbar': {method: 'user'},
            'page': {method: 'dom'},
            'table': {method: 'dom'}
        };
    else if (type.toLowerCase() === 'js')
        return {
            'footer': {method: 'user'},
            'form': {method: 'user'},
            'heading': {method: 'user'},
            'page': {method: 'user'}
        };
    else
        return false;
}

function getPageRelation(module, page) {

    var obj;
    obj = {
        // old student center
        'SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL': {
            'SSS_STUDENT_CENTER': {
                default: true,
                css: ['font', 'page', 'SSS_STUDENT_CENTER'],
                js: ['page', 'SSS_STUDENT_CENTER']
            }
        },
        // my academics
        'SA_LEARNER_SERVICES.SSS_MY_ACAD.GBL': {
            'SSS_MY_ACAD': {
                default: true,
                css: ['font', 'navbar', 'heading', 'page', 'footer', 'SSS_MY_ACAD'],
                js: ['footer', 'page', 'SSS_MY_ACAD']
            }
        },
        // view my grades
        'UW_SS_MENU.UW_SSR_SSENRL_GRDE.GBL': {
            'UW_SSR_SSENRL_TERM': {
                default: true,
                css: ['font', 'footer', 'form', 'navbar', 'heading', 'page', 'footer', 'GRDE.UW_SSR_SSENRL_TERM'],
                js: ['page', 'GRDE.UW_SSR_SSENRL_TERM']
            }
        },
        // unofficial transcript
        'SA_LEARNER_SERVICES.SSS_TSRQST_UNOFF.GBL': {
            'SSS_TSRQST_UNOFF': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SSS_TSRQST_UNOFF'],
                js: ['footer', 'page', 'SSS_TSRQST_UNOFF']
            }
        },
        // proof of enrollment
        'SA_LEARNER_SERVICES.UW_ENRL_VER_REQ.GBL': {
            'UW_EVR_INTRO': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'UW_EVR_INTRO'],
                js: ['footer', 'page', 'UW_EVR_INTRO']
            }
        },
        // my undergrad program
        'UW_SS_MENU.UW_SS_MYPROG_UG.GBL': {
            'UW_SS_MYPROG_UG': {
                default: true,
                css: ['font', 'footer', 'heading', 'navbar', 'page', 'UW_SS_MYPROG_UG'],
                js: ['footer', 'page', 'UW_SS_MYPROG_UG']
            }
        },
        // course selection
        'UW_CEM.UW_CEM_BYPASS.GBL': {
            'UW_CEM_DETECT': {
                default: true,
                css: ['font', 'footer', 'heading', 'navbar', 'page', 'UW_CEM_DETECT'],
                js: ['footer', 'page', 'UW_CEM_DETECT']
            }
        },
        // view my course selection
        'UW_CEM.UW_CEM_ENRL_SRCH.GBL': {
            'UW_CEM_REQ_TERMS': {
                default: true,
                css: ['font', 'form', 'footer', 'heading', 'navbar', 'page', 'UW_CEM_REQ_TERMS'],
                js: ['page', 'UW_CEM_REQ_TERMS']
            }
        },
        // view my course selection - details
        'UW_CEM.UW_CEM_CRSE_LIST.GBL': {
            'UW_CEM_CRSE_LIST': {
                default: true,
                css: ['font', 'form', 'footer', 'heading', 'navbar', 'page', 'UW_CEM_CRSE_LIST'],
                js: ['page', 'UW_CEM_CRSE_LIST']
            }
        },
        // view my class enrollment results
        'UW_CEM.UW_CEM_TERM_SRCH.GBL': {
            'UW_CEM_TERM_SRCH': {
                default: true,
                css: ['font', 'form', 'footer', 'heading', 'navbar', 'page', 'UW_CEM_TERM_SRCH'],
                js: ['page', 'UW_CEM_TERM_SRCH']
            }
        },
        // view my class enrollment results - details
        'UW_CEM.UW_CEM_ENRL_LIST.GBL': {
            'UW_CEM_ENRL_LIST': {
                default: true,
                css: ['font', 'form', 'footer', 'heading', 'navbar', 'page', 'UW_CEM_ENRL_LIST'],
                js: ['page', 'UW_CEM_ENRL_LIST']
            }
        },
        // course selection offerings - subject
        'UW_CEM.UW_PCS_SEARCH.GBL': {
            'UW_PCS_SRCH': {
                default: true,
                css: ['font', 'form', 'footer', 'heading', 'navbar', 'page', 'UW_PCS_SRCH'],
                js: ['page', 'UW_PCS_SRCH']
            }
        },
        // course selection offerings - all
        'UW_CEM.UW_CEM_HTML_LIST.GBL': {
            'UW_CEM_HTML_LIST': {
                default: true,
                css: ['font', 'form', 'footer', 'heading', 'navbar', 'page', 'UW_CEM_HTML_LIST'],
                js: ['page', 'UW_CEM_HTML_LIST']
            }
        },
        // search for classes
        'SA_LEARNER_SERVICES.CLASS_SEARCH.GBL': {
            'SSR_CLSRCH_ENTRY': {
                default: true,
                css: ['font', 'form', 'heading', 'navbar', 'page', 'table', 'SSR_CLSRCH_ENTRY'],
                js: ['page', 'SSR_CLSRCH_ENTRY']
            }
        },
        // my class schedule - list view
        'SA_LEARNER_SERVICES.SSR_SSENRL_LIST.GBL': {
            'SSR_SSENRL_LIST': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SSR_SSENRL_LIST'],
                js: ['footer', 'page', 'SSR_SSENRL_LIST']
            },
            'SSR_SSENRL_TERM': {
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SSR_SSENRL_TERM', 'SSR_SSENRL_LIST'],
                js: ['footer', 'page', 'SSR_SSENRL_TERM', 'SSR_SSENRL_LIST']
            }
        },
        // my class schedule - weekly calendar view
        'SA_LEARNER_SERVICES.SSR_SSENRL_SCHD_W.GBL': {
            'SSR_SS_WEEK': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SSR_SS_WEEK'],
                js: ['footer', 'page', 'SSR_SS_WEEK']
            }
        },
        // shopping cart
        'SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL': {
            'SSR_SSENRL_CART': {
                default: true,
                css: ['font', 'form', 'heading', 'navbar', 'page', 'table'],
                js: ['page']
            }
        },
        // shopping cart - enroll
        'SA_LEARNER_SERVICES_2.SSR_SSENRL_ADD.GBL': {
            'SSR_SSENRL_ADD_C': {
                default: true,
                css: ['font', 'form', 'heading', 'navbar', 'page', 'table', 'SSR_SSENRL_ADD_C'],
                js: ['page']
            }
        },
        // add classes
        'SA_LEARNER_SERVICES.SSR_SSENRL_CART.GBL': {
            'SSR_SSENRL_CART': {
                default: true,
                css: ['font', 'form', 'heading', 'navbar', 'page', 'table'],
                js: ['page']
            }
        },
        // add classes - step 2
        'SA_LEARNER_SERVICES.SSR_SSENRL_ADD.GBL': {
            'SSR_SSENRL_ADD_C': {
                default: true,
                css: ['font', 'form', 'heading', 'navbar', 'page', 'table'],
                js: ['page']
            }
        },
        // drop classes
        'SA_LEARNER_SERVICES.SSR_SSENRL_DROP.GBL': {
            'SSR_SSENRL_DROP': {
                default: true,
                css: ['font', 'form', 'heading', 'navbar', 'page', 'table'],
                js: ['page']
            }
        },
        // swap a class
        'SA_LEARNER_SERVICES.SSR_SSENRL_SWAP.GBL': {
            'SSR_SSENRL_SWAP': {
                default: true,
                css: ['font', 'form', 'heading', 'navbar', 'page', 'table'],
                js: ['page']
            }
        },
        // edit class enrollment options
        'SA_LEARNER_SERVICES.SSR_SSENRL_EDIT.GBL': {
            'SSR_SSENRL_EDIT': {
                default: true,
                css: ['font', 'form', 'heading', 'navbar', 'page', 'table'],
                js: ['page']
            }
        },
        // term information
        'SA_LEARNER_SERVICES.SSR_SS_TERM_LINKS.GBL': {
            'SSR_SS_TERM_LINKS': {
                default: true,
                css: ['font', 'footer', 'heading', 'navbar', 'page', 'SSR_SS_TERM_LINKS'],
                js: ['footer', 'page', 'SSR_SS_TERM_LINKS']
            }
        },
        // term information - enrollment dates
        'SA_LEARNER_SERVICES.SSR_SSENRL_APPT.GBL': {
            'SSR_SSENRL_APPT': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SSR_SSENRL_APPT'],
                js: ['page', 'SSR_SSENRL_APPT']
            }
        },
        // exam information
        'UW_SS_MENU.UW_SSR_SSENRL_LIST.GBL': {
            'UW_SSR_SSENRL_TERM': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'UW_SSR_SSENRL_TERM'],
                js: ['footer', 'page', 'UW_SSR_SSENRL_TERM']
            },
            'UW_SSR_SSENRL_LIST': {
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'UW_SSR_SSENRL_LIST'],
                js: ['footer', 'page', 'UW_SSR_SSENRL_LIST']
            }
        },
        // financial aid
        'SA_LEARNER_SERVICES.SS_FA_AWARDS.GBL': {
            'SS_FA_AWD_AY_SEL': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SS_FA_AWD_AY_SEL'],
                js: ['page', 'SS_FA_AWD_AY_SEL']
            }
        },
        // account inquiry
        'SA_LEARNER_SERVICES.UW_SS_ACCT_SUMMARY.GBL': {
            'UW_SS_ACCT_SUMMARY': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'UW_SS_ACCT_SUMMARY'],
                js: ['page', 'UW_SS_ACCT_SUMMARY']
            },
            'UW_SS_TERM_DETAIL': {
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'UW_SS_TERM_DETAIL'],
                js: ['page', 'UW_SS_TERM_DETAIL']
            }
        },
        // promissory note
        'UW_SS_MENU.UW_PNOTE.GBL': {
            'UW_PNOTE': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'UW_PNOTE'],
                js: ['page', 'UW_PNOTE']
            }
        },
        // tax receipts
        'SA_LEARNER_SERVICES.UW_SS_TAX_RECEIPTS.GBL': {
            'UW_SS_TAX_RECEIPTS': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'UW_SS_TAX_RECEIPTS'],
                js: ['page', 'UW_SS_TAX_RECEIPTS']
            }
        },
        // manage my bank account
        'SA_LEARNER_SERVICES.SSF_BANK_SUMM.GBL': {
            'SSF_SS_BANK_VW': {
                default: true,
                css: [],
                js: []
            }
        },
        // addresses
        'CC_PORTFOLIO.SS_CC_ADDRESSES.GBL': {
            'SS_ADDRESSES': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SS_ADDRESSES'],
                js: ['footer', 'page', 'SS_ADDRESSES']
            }
        },
        // names
        'CC_PORTFOLIO.SS_CC_NAMES.GBL': {
            'SS_CC_NAME': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SS_CC_NAME'],
                js: ['footer', 'page', 'SS_CC_NAME']
            }
        },
        // phone numbers
        'CC_PORTFOLIO.SS_CC_PERS_PHONE.GBL': {
            'SS_CC_PERS_PHONE': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SS_CC_PERS_PHONE'],
                js: ['footer', 'page', 'SS_CC_PERS_PHONE']
            }
        },
        // email
        'CC_PORTFOLIO.SS_CC_EMAIL_ADDR.GBL': {
            'SS_CC_EMAIL_ADDR': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SS_CC_EMAIL_ADDR'],
                js: ['heading', 'footer', 'page', 'SS_CC_EMAIL_ADDR']
            }
        },
        // emergency contacts
        'CC_PORTFOLIO.SS_CC_EMERG_CNTCT.GBL': {
            'SS_CC_EMRG_CNTCT_L': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SS_CC_EMRG_CNTCT_L'],
                js: ['footer', 'page', 'SS_CC_EMRG_CNTCT_L']
            }
        },
        // demographic information
        'CC_PORTFOLIO.SS_CC_DEMOG_DATA.GBL': {
            'SS_CC_DEMOG_DATA': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SS_CC_DEMOG_DATA'],
                js: ['footer', 'page', 'SS_CC_DEMOG_DATA']
            }
        },
        // citizenship/immigration documents
        'UW_SS_MENU.UW_SS_CC_VISA_DOC.GBL': {
            'UW_SS_CC_VISA_DOC': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'UW_SS_CC_VISA_DOC'],
                js: ['footer', 'page', 'UW_SS_CC_VISA_DOC']
            }
        },
        // influenza absence declaration
        'CC_PORTFOLIO.UW_SS_CC_ABSENCE.GBL': {
            'UW_SS_CC_INFL_NORM': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'UW_SS_CC_INFL_NORM'],
                js: ['footer', 'page', 'UW_SS_CC_INFL_NORM']
            }
        },
        // holds
        'CC_PORTFOLIO.SS_CC_HOLDS.GBL': {
            'SS_CC_HOLDS': {
                default: true,
                css: ['font', 'footer', 'form', 'heading', 'navbar', 'page', 'SS_CC_HOLDS'],
                js: ['footer', 'page', 'SS_CC_HOLDS']
            }
        }
    };

    if (typeof module !== typeof undefined) {

        if (typeof obj[module] === typeof undefined) return false;

        if (typeof page !== typeof undefined) {
            if (typeof obj[module][page] === typeof undefined) return false;
            return obj[module][page];
        } else {
            return obj[module];
        }

    }

    return obj;

}

function getLink(key) {
    var list = {
        darklightStore: 'https://chrome.google.com/webstore/detail/learn-darklight/lhodieepeghcemhpbloffmljoklaklho',
        azureStore: 'https://chrome.google.com/webstore/detail/waterlooworks-azure/peeaakkcmdoeljddgdkcailflcballmm',
        autologStore: 'https://chrome.google.com/webstore/detail/waterloo-autolog/ncpmlgiinkikhgijoplpnjggobinhkpl',
        raspberryStore: 'https://chrome.google.com/webstore/detail/quest-raspberry/ifhnmgllkaeebiklhakndljclagikoak',
        feedback: 'https://docs.google.com/forms/d/e/1FAIpQLSclsWFwy27uSvrXv-59W2m6AW3ReA3yb5HjWGW6W3KVjabq8g/viewform?usp=pp_url&entry.742841570=@@extVersion@@&entry.797603490=@@browser@@&entry.865994972=@@os@@',
        officialWebsite: 'https://www.zijianshao.com/raspberry/',
        github: 'https://github.com/SssWind/Quest-Raspberry',
        donate: 'https://www.paypal.me/zjshao',
        mailTo: 'mailto:sam.zj.shao@gmail.com?Subject=Quest Raspberry Extension',
        questLogin: 'https://quest.pecs.uwaterloo.ca/psp/SS/?cmd=login&languageCd=ENG'
    };
    return list[key];
}