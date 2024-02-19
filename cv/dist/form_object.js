"use strict";$.fn.formObject=function(){var e={};return $.each($(this).serializeArray(),function(n,t){e[t.name]=t.value||""}),e};
