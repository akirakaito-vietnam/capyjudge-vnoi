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
            } else {
                // console.warn('MathJax not loaded yet');
            }
        }

        var $jax = $content.find('.require-mathjax-support');
        if ($jax.length) {
            if (!('MathJax' in window)) {
                $.ajax({
                    type: 'GET',
                    url: $jax.attr('data-config'),
                    dataType: 'script',
                    cache: true,
                    success: function () {
                        window.MathJax = window.MathJax || {};
                        window.MathJax.startup = {typeset: false};
                        
                        $.ajax({
                            type: 'GET',
                            url: '/static/vnoj/mathjax/3.2.0/es5/tex-chtml.min.js',
                            dataType: 'script',
                            cache: true,
                            success: function() {
                                var checkMathJax = setInterval(function() {
                                    if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
                                        clearInterval(checkMathJax);
                                        update_math();
                                    }
                                }, 100);
                                
                                setTimeout(function() {
                                    clearInterval(checkMathJax);
                                    console.error('MathJax failed to initialize');
                                }, 5000);
                            },
                            error: function() {
                                console.error('Failed to load MathJax core');
                            }
                        });
                    },
                    error: function() {
                        console.error('Failed to load MathJax config');
                    }
                });
            } else {
                update_math();
            }
        }
    });
});