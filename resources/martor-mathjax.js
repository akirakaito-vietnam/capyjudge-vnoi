jQuery(function ($) {
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
            if (!window.MathJax || typeof MathJax.typesetPromise !== 'function') {
                $.getScript($jax.attr('data-config'))
                    .done(function() {
                        return $.getScript('/static/vnoj/mathjax/3.2.0/es5/tex-chtml.min.js');
                    })
                    .done(function() {
                        console.log('MathJax loaded dynamically');

                        var checkMathJax = setInterval(function() {
                            if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
                                clearInterval(checkMathJax);
                                update_math();
                            }
                        }, 100);
                        
                        setTimeout(function() {
                            clearInterval(checkMathJax);
                        }, 5000);
                    })
                    .fail(function() {
                        console.warn('Failed to load MathJax');
                    });
            } else {
                update_math();
            }
        }
    });
});