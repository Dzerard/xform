// Including ngTranslate
angular.module("ngTranslate",["ng"]).config(["$provide",function(t){$TranslateProvider=function(){var t,n={};this.translations=function(t,r){if(!t&&!r)return n;if(t&&!r){if(angular.isString(t))return n[t];n=t}else n[t]=r},this.uses=function(r){if(!r)return t;if(!n[r])throw Error("$translateProvider couldn't find translationTable for langKey: '"+r+"'");t=r},this.$get=["$interpolate","$log",function(r,a){return $translate=function(e,i){var l=t?n[t][e]:n[e];return l?r(l)(i):(a.warn("Translation for "+e+" doesn't exist"),e)},$translate.uses=function(n){return n?(t=n,void 0):t},$translate}]},t.provider("$translate",$TranslateProvider)}]),angular.module("ngTranslate").directive("translate",["$filter","$interpolate",function(t,n){var r=t("translate");return{restrict:"A",scope:!0,link:function(t,a,e){e.$observe("translate",function(r){t.translationId=angular.equals(r,"")?n(a.text())(t.$parent):r}),e.$observe("values",function(n){t.interpolateParams=n}),t.$watch("translationId + interpolateParams",function(){a.html(r(t.translationId,t.interpolateParams))})}}}]),angular.module("ngTranslate").filter("translate",["$parse","$translate",function(t,n){return function(r,a){return angular.isObject(a)||(a=t(a)()),n(r,a)}}]);

// Configuring your module, asking for ngTranslate as dependency
var app = angular.module('xFormation', ['ngTranslate']);

var globalTranslations = {    
    'year' : function() {var d=new Date(); return d.getFullYear().toString();},      
};

// Configuring $translateProvider
app.config(['$translateProvider', function ($translateProvider) {

    // Simply register translation table as object hash
    $translateProvider.translations('en', {
        'APP_NAME': 'GitStat',      
        'APP_SETTINGS': 'Settings',
        'APP_PATH_TO_FILE': 'Url to file',
        'APP_CHOOSE_FILE': 'Add file',
        'APP_FILE_LIST' : 'Fieles list',
        'APP_GIT_FIND_USER' : 'Find user',
        'APP_GIT_SETTINGS' : 'GitHub settings',
        'APP_USERS_LIST': 'Users list',
        'APP_CONNECT_CONNTIBUTORS': 'Get data from',
        'APP_CONNECT_BY_PATH': 'By path',
        'APP_CONNECT_BY_FILE': 'By uploaded file',
        'APP_CONNECT_BY_FILE_DEFAULT' : 'By default file',
        'APP_SETTINGS_REFRESH': 'Refresh',
        'APP_GIT_VISIT_GITHUB': 'Show in GitHub',
        'APP_SETTINGS_HIDE' : 'Settings hide',        
        'APP_PRINT' : 'Print',        
        'APP_GIT_CONTRIBUTORS_STATS': 'Developers statistics',
         'APP_LANG_EN': 'EN',
        'APP_LANG_PL': 'PL',
        'APP_GIT_STATS' : 'Stats',        
        'APP_GIT_MORE_INFO' : 'More',
        'APP_GIT_FORK' : 'Forks',
        'APP_GIT_DEFAULT_BRANCH' : 'Default branch',
        'APP_GIT_CLONE_URL' : 'Clone link',
        'APP_GIT_STARGAZERS' : 'Stargazers',
        'APP_GIT_WATCHERS' : 'Watchers', 
        'APP_GIT_OPEN_ISSUES' : 'Open issues',
        'APP_USER_TYPE_ORG' : 'Organization',
        'APP_USER_TYPE_U' : 'Private person',
        'APP_PROFILE_INFO' : 'Profile info',
        'APP_PROJECT_LIST' : 'Project list',
        'APP_GIT_FOLLOWERS' : 'Followers',
        'APP_GIT_UPDATED_AT' : 'Last update',
        'APP_GIT_PUBLIC_REPOS' : 'Public repositories', 
        'APP_GIT_CREATED_ACCOUNT' : 'Created at', 
        'APP_GIT_CLONE_REPO' : 'Copy link',
        'APP_GIT_PROJECT_NAME' : 'Project name',
        'APP_GIT_LANGUAGE' : 'Project language',        
        'APP_GIT_DESCRIPTION' : 'Project description',   
        'APP_PROJECT_SEARCH_HINT' : 'type ...',
        'APP_PROJECT_SEARCH_HINT_COL' : 'Search by',
        'APP_PROJECT_SEARCH' : 'Search',
        'APP_PROJECT_SORT' : 'Sort',
        'APP_GITHUB_USER_SETTINGS': 'Choose user',
        'APP_GITHUB_FIND_USER_HINT' : 'search ...',
        'CURRENT_YEAR': globalTranslations.year(),
        'CONTRIBUTORS_CHART': 'Contributors',
        'CONTRIBUTORS_NICK' : 'Nick',
        'CONTRIBUTORS_TEAM' : 'Team',
        'CONTRIBUTORS_CONTRIB' : 'Contributors',         
        'GITHUB_LINK_TEXT': 'View source on GitHub',                         
        'HEADLINE': 'Introducing GitHub Stats',
        'MODAL_INFO_TITLE': 'Settings Modal Info',
        'TEXT_OK_FILE' : 'File saved !',
        'TEXT_FILE_IS_DAMAGED' : 'File is damaged !',
        'TEXT_WRONG_FILE' : 'Inccorect File',
        'TEXT_OK_URL_SAVED' : 'Url saved !',
        'TEXT_OK_C_SETTINGS_SAVED': 'Settings saved !',
        'TEXT_URL_IS_BROKEN' : 'URL to file is incorrect',    
        'TEXT_CLOSE': 'Close',
        'TEXT_CLEAR': 'Clear',
        'TEXT_SAVE': 'Save',
        'TEXT_CANCEL': 'Cancel',
        'TEXT_HIDE': 'Hide',
        'TEXT_SHOW': 'Show',
        'TEXT_LIST_EMPTY': 'Empty',       
        'TEXT_OK_GITHUB_USER_SETTINGS_SAVED' : 'Default user saved',
        'SUB_HEADLINE': 'Translations for Angular'
    });   
    
    $translateProvider.translations('pl', {
        'APP_NAME' : 'GitStat', 
        
        'APP_PRINT': 'Drukuj',
        'APP_GIT_CONTRIBUTORS_STATS': 'Statystyki programistów',
        'APP_SETTINGS': 'Ustawienia',
        'APP_PATH_TO_FILE': 'Adres url do pliku',
        'APP_CHOOSE_FILE': 'Dodaj plik',
        'APP_FILE_LIST' : 'Lista plików',
        'APP_GIT_FIND_USER' : 'Znajdź użytkownika',
        'APP_GIT_SETTINGS' : 'Ustawienia GitHub',
        'APP_USERS_LIST': 'Lista użytkowników',
        'APP_CONNECT_CONNTIBUTORS': 'Pokaż dane',
        'APP_CONNECT_BY_PATH': 'Przy użyciu ścieżki',
        'APP_CONNECT_BY_FILE': 'Za pomocą pliku',
        'APP_CONNECT_BY_FILE_DEFAULT' : 'Za pomocą domyślnego pliku',
        'TEXT_FILE_IS_DAMAGED' : 'Plik jest uszkodzony lub zawiera złe dane !',
        'TEXT_WRONG_FILE' : 'Niepoprawne rozszerzenie pliku',
        'TEXT_OK_FILE' : 'Plik został zapisany !',
        'TEXT_OK_URL_SAVED' : 'Adres został zapisany',
        'TEXT_OK_C_SETTINGS_SAVED': 'Ustawienia zostały zapisane',
        'TEXT_URL_IS_BROKEN' : 'URL do pliku jest błędny',
        'APP_GIT_VISIT_GITHUB': 'Pokaż w GitHub',
        
        'CURRENT_YEAR': globalTranslations.year(),     
        'SUB_HEADLINE': 'Translacje dla aplikacji',
        'GITHUB_LINK_TEXT': 'Repo link',
        'APP_SETTINGS_HIDE': 'Ukryj ustawienia',
        'CONTRIBUTORS_CHART': 'Developerzy',
        'CONTRIBUTORS_CONTRIB' : 'Udział',
        'CONTRIBUTORS_NICK' : 'Nick',
        'CONTRIBUTORS_TEAM' : 'Zespół',
        'APP_SETTINGS_REFRESH': 'Odśwież',
        'MODAL_INFO_TITLE': 'Ustawienia informacje',
        'HEADLINE': 'Statystyki',
        'TEXT_CLOSE': 'Zamknij',
        'TEXT_CLEAR': 'Wyczyść',
        'TEXT_SAVE': 'Zapisz',
        'TEXT_CANCEL': 'Anuluj',
        'TEXT_HIDE': 'Ukryj',
        'TEXT_SHOW': 'Pokaż',
        'TEXT_LIST_EMPTY': 'Lista jest pusta',
        'APP_LANG_EN': 'EN',
        'APP_LANG_PL': 'PL',
        'APP_GIT_STATS' : 'Statystyki',
        'APP_GIT_MORE_INFO' : 'Więcej',
        'APP_GIT_FORK' : 'Rozwidlenia',
        'APP_GIT_DEFAULT_BRANCH' : 'Domyślny branch',
        'APP_GIT_CLONE_URL' : 'Link do klonowania',
        'APP_GIT_STARGAZERS' : 'Gwiazdki',
        'APP_GIT_WATCHERS' : 'Obserwatorzy',
        'APP_GIT_OPEN_ISSUES' : 'Otwarte zagadnienia',
        'APP_USER_TYPE_ORG' : 'Firma',
        'APP_USER_TYPE_U' : 'Osoba prywatna',
        'APP_PROFILE_INFO' : 'Informacje o użytkowniku',
        'APP_PROJECT_LIST' : 'Lista projektów',
        'APP_GIT_FOLLOWERS' : 'Followers',
        'APP_GIT_UPDATED_AT' : 'Data aktualizacji',
        'APP_GIT_PUBLIC_REPOS' : 'Liczba repozytoriów', 
        'APP_GIT_CREATED_ACCOUNT' : 'Data utworzenia konta', 
        'APP_GIT_CLONE_REPO' : 'Skopiuj link',
        'APP_PROJECT_SEARCH' : 'Szukaj',
        'APP_PROJECT_SEARCH_HINT' : 'czego szukasz ?',
        'APP_GIT_PROJECT_NAME' : 'Nazwa projektu',
        'APP_GIT_LANGUAGE' : 'Język',        
        'APP_GIT_DESCRIPTION' : 'Opis projektu',
        'APP_PROJECT_SORT' : 'Sortuj',
        'APP_PROJECT_SEARCH_HINT_COL' : 'Szukaj po',
        'APP_GITHUB_USER_SETTINGS': 'Wybierz użytkownika',
        'APP_GITHUB_FIND_USER_HINT' : 'kogo szukamy ?',
        'TEXT_OK_GITHUB_USER_SETTINGS_SAVED' : 'Użytkownik został zapisany'
      
    });   
    
    //localStorage vs cookie for load language    
    var lang = localStorage.getItem('language');
    
    if(lang === 'pl') {
        $translateProvider.uses('pl');
    } else {
        $translateProvider.uses('en');
    }
    
}]);

app.controller('ctrl', ['$translate', '$scope', function ($translate, $scope) {
    $scope.toggleLangPl = function () {
        $translate.uses('pl');       
    };
    $scope.toggleLangEn = function () {
        $translate.uses('en');       
    };
    $scope.windowPrint = function() {
        window.print();
    };        
}]);
