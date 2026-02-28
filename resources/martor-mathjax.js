jQuery(function ($) {
    var mathjaxLoading = false;
    
    $(document).on('martor:preview', function (e, $content) {
        function update_math() {
            if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
                MathJax.typesetPromise([$content[0]]).then(function () {
                    $content.find('.tex-image').hide();
                    $content.find('.tex-text').show();
                }).catch(function(err) {
                    console.error('MathJax error:', err);
                });
            }
        }

        var $jax = $content.find('.require-mathjax-support');
        if ($jax.length) {
            if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
                update_math();
            }
            else if (mathjaxLoading) {
                var checkMathJax = setInterval(function() {
                    if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
                        clearInterval(checkMathJax);
                        update_math();
                    }
                }, 100);
                
                setTimeout(function() {
                    clearInterval(checkMathJax);
                }, 5000);
            }
            else {
                mathjaxLoading = true;
                
                $.getScript($jax.attr('data-config'))
                    .done(function() {
                        return $.getScript('/static/vnoj/mathjax/3.2.0/es5/tex-chtml.min.js');
                    })
                    .done(function() {
                        mathjaxLoading = false;
                        update_math();
                    })
                    .fail(function() {
                        mathjaxLoading = false;
                        console.warn('Failed to load MathJax');
                    });
            }
        }
    });
});