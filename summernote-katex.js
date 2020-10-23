(function (factory) {
    if(typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if(typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}(function ($) {
    $.extend(true,$.summernote.lang, {
        'en-US': {
            'summernote-katex': {
                tooltip: 'Math expression',
                dialogTitle: 'Insert math expression',
                insLabel: 'TeX commands',
                popoverTitle: 'Examples',
                headerCommand: 'Command',
                headerResult: 'Result',
            }
        },
        'es-ES': {
            'summernote-katex': {
                tooltip: 'Expresión matemática',
                dialogTitle: 'Insertar expresión matemática',
                insLabel: 'Comandos TeX',
                popoverTitle: 'Ejemplos',
                headerCommand: 'Comando',
                headerResult: 'Resultado',
            }
        }
    });
    
    $.extend($.summernote.plugins, {
        'summernote-katex': function (context) {
            let self = this,
                options = context.options,
                lang = options.langInfo,
                ui = $.summernote.ui,
                $editor = context.layoutInfo.editor;
            const t = Date.now() / 1000;
            let id = t.toString(16).split('.').join('');
            while(id.length < 14) id += '0';
            context.memo('button.katex', function () {
                let button = ui.button({
                    contents: '<i class="fas fa-calculator"></i>',
                    tooltip: lang['summernote-katex'].tooltip,
                    click: function () {
                        context.invoke('summernote-katex.show');
                    },
                }).render();
                return button;
            });
            
            this.events = {
                'summernote.init': function () {
                    
                }
            }
            
            this.initialize = function () {
                let $container = options.dialogsInBody ? $(document.body) : $editor;
                
                this.$dialog = ui.dialog({
                    title: lang['summernote-katex'].dialogTitle,
                    body: '<div class="form-group">' +
                        '<label for="note-katex-' + id + '-ins-tex" class="note-form-label">' + lang['summernote-katex'].insLabel + '</label>' +
                        '<div class="input-group">' +
                            '<input id="note-katex-' + id + '-ins-tex" class="note-katex-ins-tex form-control note-form-control note-input" type="text" autocapitalize="none">' +
                            '<div class="input-group-append">' +
                                '<button class="note-katex-help-btn btn btn-outline-secondary"><i class="fas fa-question fa-fw"></i></button>' +
                            '</div>' +
                        '</div>' +
                        '<output class="note-katex-ins-prev d-block mt-2 text-center" for="note-katex-' + id + '-ins-tex" style="font-size: 1.5rem;"></output>' +
                    '</div>',
                    footer: '<button class="btn btn-primary note-katex-ins-btn" disabled>' + lang['summernote-katex'].dialogTitle + '</button>',
                }).render().appendTo($container);
            }
            
            this.destroy = function () {
                ui.hideDialog(this.$dialog);
                this.$dialog.remove();
            }
            
            this.show = function () {
                let texCommands;
                this.showKatexDialog(texCommands).then(function (texCommands) {
                    ui.hideDialog(self.$dialog);
                    texCommands = texCommands.replace(/\s+/, ' ');
                    texCommands = texCommands.trim();
                    if(texCommands.length == 0) return false;
                    context.invoke('editor.restoreRange');
                    context.invoke('editor.insertText', '$$' + texCommands + '$$');
                    
                });
            }
            
            this.showKatexDialog = function () {
                return $.Deferred(function (deferred) {
                    let $insTex = self.$dialog.find('.note-katex-ins-tex'),
                        $insBtn = self.$dialog.find('.note-katex-ins-btn'),
                        $helpBtn = self.$dialog.find('.note-katex-help-btn');
                    ui.onDialogShown(self.$dialog, function () {
                        let text = context.invoke('editor.getLastRange').toString();
                        text = text.replace(/^[^$]*[\$]{2}/, '');
                        text = text.replace(/[\$]{2}[^\$]*$/, '');
                        text = text.replace(/\s+/, ' ');
                        text = text.trim();
                        context.triggerEvent('dialog.shown');
                        $insBtn.click(function (e) {
                            e.preventDefault();
                            deferred.resolve($insTex.val());
                        });
                        $helpBtn.popover({
                            title: lang['summernote-katex'].popoverTitle,
                            content: $('<table id="note-katex-' + id + '-table-commands" class="table">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th scope="col">' + lang['summernote-katex'].headerCommand + '</th>' +
                                        '<th scope="col">' + lang['summernote-katex'].headerResult + '</td>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\pi</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\infin</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\alpha</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\Delta</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\theta</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\pm a</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\sum x</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">a \\geq b</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">a \\leq b</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">a \\neq b</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\vec{F}</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">x_n</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">x_{n+1}</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">e^n</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">e^{n+1}</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\overline{P_1 P_2}</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">x\\epsilon\\R</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\sqrt{x}</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\sqrt[n]{x}</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\tfrac{a}{b}</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\dfrac{a}{x+b}</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\sin x</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\sin^{-1} x</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\cos x</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\cos^{-1} x</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\tan x</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\tan^{-1} x</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\ln x</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\log_n x</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\begin{vmatrix} a & b\\\\ c & d \\end{vmatrix}</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\lim\\limits_{x \\to a} f(x)</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\int f(x) dx</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<th class="text-monospace" scope="row">\\int_a^b f(x) dx</th>' +
                                        '<td></td>' +
                                    '</tr>' +
                                '</tbody>' +
                            '</table>')[0],
                            html: true,
                            container: 'body',
                            placement: function () {
                                if(document.documentElement.clientHeight >= document.documentElement.clientWidth) {
                                    return 'bottom';
                                }
                                return 'right';
                            },
                            template: '<div class="popover" role="tooltip">' +
                                '<div class="arrow"></div>' +
                                '<h3 class="popover-header"></h3>' +
                                '<div class="popover-body py-0" style="height: 200px; overflow-y: auto;"></div>' +
                            '</div>',
                            sanitize: false,
                        });
                        $helpBtn.on('shown.bs.popover', function () {
                            $('#note-katex-' + id + '-table-commands > tbody > tr > th').each(function () {
                                $(this).siblings('td').html('');
                                katex.render($(this).text(), $(this).siblings('td')[0], {
                                    throwOnError: false
                                });
                            });
                        });
                        $insTex.focus();
                        $insTex.on('keyup', function (e) {
                            if(e.keyCode === 13) $insBtn.trigger('click');
                            let tex = $insTex.val();
                            tex = tex.replace(/\s+/, ' ');
                            if(tex.trim().length > 0) {
                                $insBtn.prop('disabled', false);
                                katex.render(tex, self.$dialog.find('.note-katex-ins-prev')[0], {
                                    throwOnError: false
                                });
                            } else {
                                $insBtn.prop('disabled', true);
                                self.$dialog.find('.note-katex-ins-prev').html('');
                            }
                        });
                        if(text.length > 0) {
                            $insTex.val(text);
                            $insTex.trigger('keyup');
                        }
                    });
                    ui.onDialogHidden(self.$dialog, function () {
                        $insBtn.off('click');
                        $insTex.off('keyup');
                        self.$dialog.find('input').val('');
                        self.$dialog.find('.note-katex-ins-prev').html('');
                        if(deferred.state() === 'pending') deferred.reject();
                    });
                    ui.showDialog(self.$dialog);
                });
            }
        }
    });
}));
