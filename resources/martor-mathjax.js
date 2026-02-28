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
                console.warn('MathJax not loaded yet');
            }
        }

        var $jax = $content.find('.require-mathjax-support');
        if ($jax.length) {
            if (!('MathJax' in window)) {
                var checkMathJax = setInterval(function() {
                    if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
                        clearInterval(checkMathJax);
                        update_math();
                    }
                }, 100);
                
                setTimeout(function() {
                    clearInterval(checkMathJax);
                }, 5000);
            } else {
                update_math();
            }
        }
    });
});